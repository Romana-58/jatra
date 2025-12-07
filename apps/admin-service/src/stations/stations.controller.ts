import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { StationsService } from './stations.service';

@ApiTags('stations')
@Controller('api/admin/stations')
export class StationsController {
  constructor(private readonly stationsService: StationsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all stations' })
  async findAll() {
    return this.stationsService.findAll();
  }
}
