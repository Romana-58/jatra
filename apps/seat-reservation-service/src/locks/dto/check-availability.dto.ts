import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsUUID, IsOptional, IsArray } from 'class-validator';

export class CheckAvailabilityDto {
  @ApiProperty({
    description: 'From station ID',
    example: '990e8400-e29b-41d4-a716-446655440000',
  })
  @IsString()
  @IsUUID()
  fromStationId: string;

  @ApiProperty({
    description: 'To station ID',
    example: 'aa0e8400-e29b-41d4-a716-446655440000',
  })
  @IsString()
  @IsUUID()
  toStationId: string;

  @ApiPropertyOptional({
    description: 'Optional: Specific seat IDs to check',
    type: [String],
    example: ['770e8400-e29b-41d4-a716-446655440000'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @IsUUID('4', { each: true })
  seatIds?: string[];
}
