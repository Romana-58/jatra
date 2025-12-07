import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './common/prisma.module';
import { TrainsModule } from './trains/trains.module';
import { RoutesModule } from './routes/routes.module';
import { JourneysModule } from './journeys/journeys.module';
import { StationsModule } from './stations/stations.module';
import { UsersModule } from './users/users.module';
import { BookingsModule } from './bookings/bookings.module';
import { StatsModule } from './stats/stats.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    PrismaModule,
    TrainsModule,
    RoutesModule,
    JourneysModule,
    StationsModule,
    UsersModule,
    BookingsModule,
    StatsModule,
  ],
})
export class AppModule {}
