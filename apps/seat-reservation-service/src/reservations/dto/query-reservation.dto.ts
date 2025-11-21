import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsEnum, IsInt, Min } from 'class-validator';

export enum ReservationStatusQuery {
  LOCKED = 'LOCKED',
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
  EXPIRED = 'EXPIRED',
  RELEASED = 'RELEASED',
}

export class QueryReservationDto {
  @ApiPropertyOptional({
    description: 'Filter by reservation status',
    enum: ReservationStatusQuery,
    example: 'CONFIRMED',
  })
  @IsOptional()
  @IsEnum(ReservationStatusQuery)
  status?: ReservationStatusQuery;

  @ApiPropertyOptional({
    description: 'Page number for pagination',
    example: 1,
    minimum: 1,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  page?: number;

  @ApiPropertyOptional({
    description: 'Items per page',
    example: 10,
    minimum: 1,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  limit?: number;
}
