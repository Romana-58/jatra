import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsIn } from 'class-validator';

export class QueryBookingsDto {
  @ApiPropertyOptional({ 
    example: 'CONFIRMED', 
    description: 'Filter by booking status',
    enum: ['DRAFT', 'SEATS_LOCKED', 'PAYMENT_PENDING', 'CONFIRMED', 'CANCELLED', 'FAILED', 'EXPIRED']
  })
  @IsOptional()
  @IsString()
  @IsIn(['DRAFT', 'SEATS_LOCKED', 'PAYMENT_PENDING', 'CONFIRMED', 'CANCELLED', 'FAILED', 'EXPIRED'])
  status?: string;

  @ApiPropertyOptional({ example: '1', description: 'Page number', default: '1' })
  @IsOptional()
  @IsString()
  page?: string = '1';

  @ApiPropertyOptional({ example: '10', description: 'Items per page', default: '10' })
  @IsOptional()
  @IsString()
  limit?: string = '10';

  @ApiPropertyOptional({ 
    example: 'createdAt', 
    description: 'Sort by field',
    enum: ['createdAt', 'totalAmount', 'status']
  })
  @IsOptional()
  @IsString()
  sortBy?: string = 'createdAt';

  @ApiPropertyOptional({ 
    example: 'desc', 
    description: 'Sort order',
    enum: ['asc', 'desc']
  })
  @IsOptional()
  @IsString()
  @IsIn(['asc', 'desc'])
  sortOrder?: string = 'desc';
}
