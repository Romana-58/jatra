import { Module } from '@nestjs/common';
import { ReservationsController } from './reservations.controller';
import { ReservationsService } from './reservations.service';
import { PrismaService } from '../common/prisma.service';
import { RedisService } from '../common/redis.service';

@Module({
  controllers: [ReservationsController],
  providers: [ReservationsService, PrismaService, RedisService],
  exports: [ReservationsService],
})
export class ReservationsModule {}
