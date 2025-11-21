import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BookingsModule } from './bookings/bookings.module';
import { PrismaService } from './common/prisma.service';
import { HttpModule } from './common/http.module';
import { RabbitMQModule } from './common/rabbitmq.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    HttpModule,
    RabbitMQModule,
    BookingsModule,
  ],
  providers: [PrismaService],
  exports: [PrismaService],
})
export class AppModule {}
