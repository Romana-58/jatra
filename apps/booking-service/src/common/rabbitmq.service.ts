import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import * as amqp from 'amqplib';

export interface BookingEvent {
  type: 'BOOKING_CONFIRMED' | 'BOOKING_CANCELLED' | 'PAYMENT_FAILED';
  bookingId: string;
  userId: string;
  data: any;
  timestamp: Date;
}

@Injectable()
export class RabbitMQService implements OnModuleInit, OnModuleDestroy {
  private connection: amqp.Connection;
  private channel: amqp.Channel;
  private readonly logger = new Logger(RabbitMQService.name);
  private readonly exchangeName = process.env.RABBITMQ_NOTIFICATION_EXCHANGE || 'notifications';

  async onModuleInit() {
    try {
      const url = process.env.RABBITMQ_URL || 'amqp://localhost:5672';
      this.connection = await amqp.connect(url);
      this.channel = await this.connection.createChannel();

      // Create exchange for notifications
      await this.channel.assertExchange(this.exchangeName, 'topic', { durable: true });

      this.logger.log('✅ RabbitMQ connected and exchange created');
    } catch (error) {
      this.logger.error('❌ Failed to connect to RabbitMQ', error);
    }
  }

  async onModuleDestroy() {
    await this.channel?.close();
    await this.connection?.close();
  }

  async publishBookingEvent(event: BookingEvent): Promise<void> {
    if (!this.channel) {
      this.logger.warn('RabbitMQ channel not available, skipping event publish');
      return;
    }

    try {
      const routingKey = `booking.${event.type.toLowerCase()}`;
      const message = JSON.stringify(event);

      this.channel.publish(
        this.exchangeName,
        routingKey,
        Buffer.from(message),
        { persistent: true }
      );

      this.logger.log(`📤 Published event: ${event.type} for booking ${event.bookingId}`);
    } catch (error) {
      this.logger.error(`Failed to publish event: ${event.type}`, error);
    }
  }
}
