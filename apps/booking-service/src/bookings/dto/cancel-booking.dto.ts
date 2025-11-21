import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class CancelBookingDto {
  @ApiProperty({ example: 'Changed travel plans', description: 'Cancellation reason' })
  @IsString()
  reason: string;

  @ApiPropertyOptional({ 
    example: 'user-uuid-here', 
    description: 'User ID (for authorization)' 
  })
  @IsOptional()
  @IsString()
  userId?: string;
}
