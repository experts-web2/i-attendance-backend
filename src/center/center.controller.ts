import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  Put,
  Delete,
  Query,
} from '@nestjs/common';
import { CenterService } from './center.service';
import { Center, CenterDocument } from './center.schema';

@Controller('center')
export class CenterController {
  constructor(private service: CenterService) {}

  @Post('')
  async createCenter(@Body() center: Center): Promise<string> {
    return await this.service.createCenter(center);
  }

  @Put('')
  async updateCenter(@Body() center: CenterDocument): Promise<boolean> {
    return await this.service.updateCenter(center);
  }

  @Delete('/:id')
  async deleteCenter(@Param('id') id: string): Promise<boolean> {
    return await this.service.deleteCenter(id);
  }

  @Get('/:id')
  async getCenter(@Param('id') id: string): Promise<CenterDocument> {
    return await this.service.getCenter(id);
  }

  @Get('')
  async getCenters(@Query('city') city?: string): Promise<CenterDocument[]> {
    console.log('City', city);
    return await this.service.getCenters(city);
  }
}
