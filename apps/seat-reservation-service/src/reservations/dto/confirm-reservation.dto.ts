import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID } from 'class-validator';

export class ConfirmReservationDto {
  @ApiProperty({
    description: 'Lock ID to confirm',
    example: 'lock_1732223400_550e8400',
  })
  @IsString()
  lockId: string;

  @ApiProperty({
    description: 'Payment ID from payment service',
    example: 'pay_1732223400_abc123',
  })
  @IsString()
  paymentId: string;
}
