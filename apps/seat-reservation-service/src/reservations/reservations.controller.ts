import {
  Controller,
  Post,
  Get,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { ReservationsService } from './reservations.service';
import { ConfirmReservationDto } from './dto/confirm-reservation.dto';
import { QueryReservationDto } from './dto/query-reservation.dto';

@ApiTags('reservations')
@Controller('reservations')
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}

  @Post('confirm')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Confirm reservation after payment',
    description:
      'Confirm a locked reservation after successful payment. Releases Redis locks and updates status to CONFIRMED.',
  })
  @ApiResponse({
    status: 200,
    description: 'Reservation confirmed successfully',
    schema: {
      example: {
        success: true,
        reservation: {
          id: '550e8400-e29b-41d4-a716-446655440000',
          status: 'CONFIRMED',
          totalFare: 3500,
        },
        paymentId: 'pay_1732223400_abc123',
        message: 'Reservation confirmed successfully',
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Lock expired or invalid status' })
  @ApiResponse({ status: 404, description: 'Reservation not found' })
  async confirmReservation(@Body() dto: ConfirmReservationDto) {
    return this.reservationsService.confirmReservation(dto);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get reservation details',
    description: 'Retrieve detailed information about a specific reservation',
  })
  @ApiParam({
    name: 'id',
    description: 'Reservation ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({ status: 200, description: 'Reservation details retrieved' })
  @ApiResponse({ status: 404, description: 'Reservation not found' })
  async getReservation(@Param('id') id: string) {
    return this.reservationsService.getReservation(id);
  }

  @Get('user/:userId')
  @ApiOperation({
    summary: "Get user's reservations",
    description: 'Retrieve all reservations for a specific user with optional status filter and pagination',
  })
  @ApiParam({
    name: 'userId',
    description: 'User ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: 'User reservations retrieved',
    schema: {
      example: {
        userId: '550e8400-e29b-41d4-a716-446655440000',
        reservations: [],
        total: 5,
        page: 1,
        limit: 10,
        totalPages: 1,
      },
    },
  })
  async getUserReservations(@Param('userId') userId: string, @Query() query: QueryReservationDto) {
    return this.reservationsService.getUserReservations(userId, query);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Cancel reservation',
    description: 'Cancel a reservation. Releases locks if status is LOCKED.',
  })
  @ApiParam({
    name: 'id',
    description: 'Reservation ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: 'Reservation cancelled successfully',
    schema: {
      example: {
        success: true,
        reservation: {
          id: '550e8400-e29b-41d4-a716-446655440000',
          status: 'CANCELLED',
        },
        message: 'Reservation cancelled successfully',
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Already cancelled or expired' })
  @ApiResponse({ status: 404, description: 'Reservation not found' })
  async cancelReservation(@Param('id') id: string) {
    return this.reservationsService.cancelReservation(id);
  }
}
