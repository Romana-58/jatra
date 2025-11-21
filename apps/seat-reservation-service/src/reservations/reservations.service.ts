import {
  Injectable,
  BadRequestException,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { RedisService } from '../common/redis.service';
import { ConfirmReservationDto } from './dto/confirm-reservation.dto';
import { QueryReservationDto } from './dto/query-reservation.dto';

@Injectable()
export class ReservationsService {
  private readonly logger = new Logger(ReservationsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
  ) {}

  async confirmReservation(dto: ConfirmReservationDto) {
    // Find reservation by lockId
    const reservation = await this.prisma.reservation.findUnique({
      where: { lockId: dto.lockId },
      include: {
        journey: {
          include: {
            train: true,
          },
        },
        fromStation: true,
        toStation: true,
      },
    });

    if (!reservation) {
      throw new NotFoundException('Reservation not found');
    }

    if (reservation.status !== 'LOCKED') {
      throw new BadRequestException(`Reservation status is ${reservation.status}, expected LOCKED`);
    }

    // Check if lock is expired
    if (reservation.lockExpiry < new Date()) {
      // Update status to expired
      await this.prisma.reservation.update({
        where: { id: reservation.id },
        data: { status: 'EXPIRED' },
      });
      throw new BadRequestException('Lock has expired');
    }

    // Update reservation status to CONFIRMED
    const confirmedReservation = await this.prisma.reservation.update({
      where: { id: reservation.id },
      data: {
        status: 'CONFIRMED',
      },
      include: {
        journey: {
          include: {
            train: true,
          },
        },
        fromStation: true,
        toStation: true,
      },
    });

    // Remove locks from Redis
    for (const seatId of reservation.seatIds) {
      const lockKey = this.getLockKey(reservation.journeyId, seatId);
      await this.redis.releaseLock(lockKey);
    }

    this.logger.log(
      `Reservation confirmed: ${reservation.id}, lockId: ${dto.lockId}, paymentId: ${dto.paymentId}`,
    );

    // TODO: Emit event to RabbitMQ for other services (booking, ticket, notification)

    return {
      success: true,
      reservation: confirmedReservation,
      paymentId: dto.paymentId,
      message: 'Reservation confirmed successfully',
    };
  }

  async getReservation(id: string) {
    const reservation = await this.prisma.reservation.findUnique({
      where: { id },
      include: {
        journey: {
          include: {
            train: {
              include: {
                coaches: {
                  include: {
                    seats: {
                      where: {
                        id: {
                          in: [], // Will be replaced by actual seat IDs
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        fromStation: true,
        toStation: true,
      },
    });

    if (!reservation) {
      throw new NotFoundException('Reservation not found');
    }

    return reservation;
  }

  async getUserReservations(userId: string, query: QueryReservationDto) {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;

    const where: any = { userId };

    if (query.status) {
      where.status = query.status;
    }

    const [reservations, total] = await Promise.all([
      this.prisma.reservation.findMany({
        where,
        include: {
          journey: {
            include: {
              train: true,
            },
          },
          fromStation: true,
          toStation: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip,
        take: limit,
      }),
      this.prisma.reservation.count({ where }),
    ]);

    return {
      userId,
      reservations,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async cancelReservation(id: string) {
    const reservation = await this.prisma.reservation.findUnique({
      where: { id },
    });

    if (!reservation) {
      throw new NotFoundException('Reservation not found');
    }

    if (reservation.status === 'CANCELLED') {
      throw new BadRequestException('Reservation is already cancelled');
    }

    if (reservation.status === 'EXPIRED') {
      throw new BadRequestException('Cannot cancel an expired reservation');
    }

    // If status is LOCKED, release Redis locks
    if (reservation.status === 'LOCKED') {
      for (const seatId of reservation.seatIds) {
        const lockKey = this.getLockKey(reservation.journeyId, seatId);
        await this.redis.releaseLock(lockKey);
      }
    }

    // Update status
    const cancelledReservation = await this.prisma.reservation.update({
      where: { id },
      data: { status: 'CANCELLED' },
    });

    this.logger.log(`Reservation cancelled: ${id}`);

    // TODO: If status was CONFIRMED, emit refund event to payment service

    return {
      success: true,
      reservation: cancelledReservation,
      message: 'Reservation cancelled successfully',
    };
  }

  // Helper methods
  private getLockKey(journeyId: string, seatId: string): string {
    return `seat:lock:${journeyId}:${seatId}`;
  }
}
