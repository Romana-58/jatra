import { Module } from '@nestjs/common';
import { LocksController } from './locks.controller';
import { LocksService } from './locks.service';
import { PrismaService } from '../common/prisma.service';
import { RedisService } from '../common/redis.service';

@Module({
  controllers: [LocksController],
  providers: [LocksService, PrismaService, RedisService],
  exports: [LocksService],
})
export class LocksModule {}
