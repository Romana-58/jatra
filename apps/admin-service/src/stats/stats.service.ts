import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';

@Injectable()
export class StatsService {
  constructor(private prisma: PrismaService) {}

  async getOverview() {
    const [totalUsers, totalTrains, totalBookings, totalRevenue] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.train.count(),
      this.prisma.booking.count(),
      this.prisma.booking.aggregate({
        where: { status: 'CONFIRMED' },
        _sum: { totalAmount: true },
      }),
    ]);

    const recentBookings = await this.prisma.booking.count({
      where: {
        createdAt: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000),
        },
      },
    });

    return {
      totalUsers,
      totalTrains,
      totalBookings,
      totalRevenue: totalRevenue._sum.totalAmount || 0,
      recentBookings24h: recentBookings,
    };
  }

  async getRevenue() {
    const revenue = await this.prisma.booking.groupBy({
      by: ['status'],
      _sum: {
        totalAmount: true,
      },
      _count: {
        id: true,
      },
    });

    return revenue.map((r) => ({
      status: r.status,
      totalAmount: r._sum.totalAmount || 0,
      bookingCount: r._count.id,
    }));
  }
}
