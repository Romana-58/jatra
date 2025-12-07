import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';

@Injectable()
export class JourneysService {
  constructor(private prisma: PrismaService) {}

  async findAll(page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const [journeys, total] = await Promise.all([
      this.prisma.journey.findMany({
        skip,
        take: limit,
        include: {
          train: true,
          route: true,
        },
        orderBy: { journeyDate: 'desc' },
      }),
      this.prisma.journey.count(),
    ]);

    return {
      journeys,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    return this.prisma.journey.findUnique({
      where: { id },
      include: {
        train: true,
        route: true,
        bookings: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });
  }
}
