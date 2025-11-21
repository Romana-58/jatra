import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsInt, Min, Max } from 'class-validator';

export class ExtendLockDto {
  @ApiProperty({
    description: 'Lock ID to extend',
    example: 'lock_1732223400_550e8400',
  })
  @IsString()
  lockId: string;

  @ApiProperty({
    description: 'Additional seconds to extend the lock',
    example: 300,
    minimum: 60,
    maximum: 600,
  })
  @IsInt()
  @Min(60)
  @Max(600)
  extensionSeconds: number;
}
