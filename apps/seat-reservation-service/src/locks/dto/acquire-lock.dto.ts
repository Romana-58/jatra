import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsArray, IsUUID, ArrayMinSize } from 'class-validator';

export class AcquireLockDto {
  @ApiProperty({
    description: 'User ID acquiring the lock',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsString()
  @IsUUID()
  userId: string;

  @ApiProperty({
    description: 'Journey ID for the seat reservation',
    example: '660e8400-e29b-41d4-a716-446655440000',
  })
  @IsString()
  @IsUUID()
  journeyId: string;

  @ApiProperty({
    description: 'Array of seat IDs to lock',
    example: ['770e8400-e29b-41d4-a716-446655440000', '880e8400-e29b-41d4-a716-446655440000'],
    type: [String],
  })
  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  @IsUUID('4', { each: true })
  seatIds: string[];

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
}
