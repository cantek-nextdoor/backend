import { Controller, Get, Header } from '@nestjs/common';
import { LocationService } from '../location/location.service';

@Controller('cat')
export class CatController {

  constructor(private _locService: LocationService) {}

  @Get()
  @Header('content-type', 'application/json')
  findAll(): Record<string, string> {
    return { hi: 'cat' };
  }

  @Get('all')
  async findAllPostal() {
    const result = await this._locService.getAllLocations();
    return result;
  }

  
  @Get('test')
  async GetAllExcept() {
    const result = await this._locService.getNearbyPostalCodes(1, "L5B 2M6");
    return result;
  }
}
