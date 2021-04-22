import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  Put,
  Delete,
} from '@nestjs/common';
import { CityService } from './city.service';
import { City, CityDocument } from './city.schema';

@Controller('city')
export class CityController {
  constructor(private service: CityService) {}

  @Post('')
  async createCity(@Body() city: City): Promise<string> {
    return await this.service.createCity(city);
  }

  @Put('')
  async updateCity(@Body() city: CityDocument): Promise<boolean> {
    return await this.service.updateCity(city);
  }

  @Delete('/:id')
  async deleteCity(@Param('id') id: string): Promise<boolean> {
    return await this.service.deleteCity(id);
  }

  @Get('/:id')
  async getCity(@Param('id') id: string): Promise<CityDocument> {
    return await this.service.getCity(id);
  }

  @Get('')
  async getCities(): Promise<CityDocument[]> {
    return await this.service.getCities();
  }
}
