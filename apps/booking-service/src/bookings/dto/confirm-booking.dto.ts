import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class ConfirmBookingDto {
  @ApiProperty({ example: 'payment-uuid-here', description: 'Payment ID from payment service' })
  @IsString()
  @IsNotEmpty()
  paymentId: string;

  @ApiProperty({ example: 'TXN_1234567890', description: 'Transaction ID from payment gateway' })
  @IsString()
  @IsNotEmpty()
  transactionId: string;
}
