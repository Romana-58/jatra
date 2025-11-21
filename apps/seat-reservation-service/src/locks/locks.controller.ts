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
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { LocksService } from './locks.service';
import { AcquireLockDto } from './dto/acquire-lock.dto';
import { CheckAvailabilityDto } from './dto/check-availability.dto';
import { ExtendLockDto } from './dto/extend-lock.dto';

@ApiTags('locks')
@Controller('locks')
export class LocksController {
  constructor(private readonly locksService: LocksService) {}

  @Post('acquire')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Acquire seat locks',
    description: 'Lock seats for 10 minutes during checkout process. Returns lockId and expiry time.',
  })
  @ApiResponse({
    status: 201,
    description: 'Locks acquired successfully',
    schema: {
      example: {
        lockId: 'lock_1732223400_550e8400',
        reservationId: '550e8400-e29b-41d4-a716-446655440000',
        expiresAt: '2025-11-21T22:30:00.000Z',
        totalFare: 3500,
        seatCount: 2,
        ttlSeconds: 600,
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Invalid input or seats do not exist' })
  @ApiResponse({ status: 404, description: 'Journey not found' })
  @ApiResponse({ status: 409, description: 'Seats already locked or booked' })
  async acquireLock(@Body() dto: AcquireLockDto) {
    return this.locksService.acquireLock(dto);
  }

  @Get('availability/:journeyId')
  @ApiOperation({
    summary: 'Check seat availability',
    description: 'Check which seats are available, locked, or booked for a journey',
  })
  @ApiParam({
    name: 'journeyId',
    description: 'Journey ID to check availability',
    example: '660e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: 'Availability information retrieved',
    schema: {
      example: {
        journeyId: '660e8400-e29b-41d4-a716-446655440000',
        totalSeats: 180,
        availableSeats: ['seat-id-1', 'seat-id-2'],
        lockedSeats: ['seat-id-3'],
        bookedSeats: ['seat-id-4'],
        availableCount: 175,
        lockedCount: 2,
        bookedCount: 3,
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Journey not found' })
  async checkAvailability(
    @Param('journeyId') journeyId: string,
    @Query() dto: CheckAvailabilityDto,
  ) {
    return this.locksService.checkAvailability(journeyId, dto);
  }

  @Post('extend')
  @ApiOperation({
    summary: 'Extend lock duration',
    description: 'Extend the TTL of an existing lock by additional seconds',
  })
  @ApiResponse({
    status: 200,
    description: 'Lock extended successfully',
    schema: {
      example: {
        success: true,
        lockId: 'lock_1732223400_550e8400',
        newExpiresAt: '2025-11-21T22:35:00.000Z',
        extendedSeconds: 300,
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Lock not in LOCKED status or already expired' })
  @ApiResponse({ status: 404, description: 'Lock not found' })
  async extendLock(@Body() dto: ExtendLockDto) {
    return this.locksService.extendLock(dto);
  }

  @Delete(':lockId')
  @ApiOperation({
    summary: 'Release lock manually',
    description: 'Manually release a lock before it expires',
  })
  @ApiParam({
    name: 'lockId',
    description: 'Lock ID to release',
    example: 'lock_1732223400_550e8400',
  })
  @ApiResponse({
    status: 200,
    description: 'Lock released successfully',
    schema: {
      example: {
        success: true,
        lockId: 'lock_1732223400_550e8400',
        releasedSeats: ['seat-id-1', 'seat-id-2'],
        reservationId: '550e8400-e29b-41d4-a716-446655440000',
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Lock not in LOCKED status' })
  @ApiResponse({ status: 404, description: 'Lock not found' })
  async releaseLock(@Param('lockId') lockId: string) {
    return this.locksService.releaseLock(lockId);
  }

  @Get('user/:userId')
  @ApiOperation({
    summary: "Get user's active locks",
    description: 'Retrieve all active (non-expired) locks for a specific user',
  })
  @ApiParam({
    name: 'userId',
    description: 'User ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: 'User locks retrieved',
    schema: {
      example: {
        userId: '550e8400-e29b-41d4-a716-446655440000',
        activeLocks: 1,
        locks: [],
      },
    },
  })
  async getUserLocks(@Param('userId') userId: string) {
    return this.locksService.getUserLocks(userId);
  }
}
