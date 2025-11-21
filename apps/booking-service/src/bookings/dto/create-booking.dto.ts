import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNumber, IsArray, IsNotEmpty, Min, Max, ArrayMinSize, ArrayMaxSize } from 'class-validator';

export class CreateBookingDto {
  @ApiProperty({ example: 'user-uuid-here', description: 'User ID' })
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({ example: 'journey-uuid-here', description: 'Journey ID' })
  @IsString()
  @IsNotEmpty()
  journeyId: string;

  @ApiProperty({ 
    example: ['seat-uuid-1', 'seat-uuid-2'], 
    description: 'Array of seat IDs to book',
    minItems: 1,
    maxItems: 6
  })
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(6)
  @IsString({ each: true })
  seatIds: string[];

  @ApiProperty({ example: 'station-uuid-from', description: 'From station ID' })
  @IsString()
  @IsNotEmpty()
  fromStationId: string;

  @ApiProperty({ example: 'station-uuid-to', description: 'To station ID' })
  @IsString()
  @IsNotEmpty()
  toStationId: string;

  @ApiProperty({ example: 1500.00, description: 'Total booking amount' })
  @IsNumber()
  @Min(0)
  totalAmount: number;

  @ApiPropertyOptional({ 
    example: 'CREDIT_CARD', 
    description: 'Payment method',
    enum: ['CREDIT_CARD', 'DEBIT_CARD', 'MOBILE_BANKING', 'NET_BANKING', 'WALLET']
  })
  @IsString()
  paymentMethod: string;

  @ApiPropertyOptional({ description: 'Card or mobile banking details' })
  paymentDetails?: any;
}
