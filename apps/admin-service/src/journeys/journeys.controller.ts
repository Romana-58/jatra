import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { JourneysService } from './journeys.service';

@ApiTags('journeys')
@Controller('api/admin/journeys')
export class JourneysController {
  constructor(private readonly journeysService: JourneysService) {}

  @Get()
  @ApiOperation({ summary: 'Get all journeys with pagination' })
  async findAll(@Query('page') page?: number, @Query('limit') limit?: number) {
    return this.journeysService.findAll(page, limit);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get journey by ID' })
  async findOne(@Param('id') id: string) {
    return this.journeysService.findOne(id);
  }
}
