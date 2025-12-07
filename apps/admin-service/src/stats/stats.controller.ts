import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { StatsService } from './stats.service';

@ApiTags('stats')
@Controller('api/admin/stats')
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  @Get('overview')
  @ApiOperation({ summary: 'Get system overview statistics' })
  async getOverview() {
    return this.statsService.getOverview();
  }

  @Get('revenue')
  @ApiOperation({ summary: 'Get revenue statistics by status' })
  async getRevenue() {
    return this.statsService.getRevenue();
  }
}
