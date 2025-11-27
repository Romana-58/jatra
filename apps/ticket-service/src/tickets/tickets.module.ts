import { Module } from '@nestjs/common';
import { TicketsController } from './tickets.controller';
import { TicketsService } from './tickets.service';
import { QRCodeService } from './qrcode.service';
import { PDFService } from './pdf.service';
import { PrismaService } from '../common/prisma.service';
import { RabbitMQConsumerService } from '../common/rabbitmq-consumer.service';

@Module({
  controllers: [TicketsController],
  providers: [TicketsService, QRCodeService, PDFService, PrismaService, RabbitMQConsumerService],
  exports: [TicketsService],
})
export class TicketsModule {}
