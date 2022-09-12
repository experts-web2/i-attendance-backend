import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Query,
  Delete,
  Put,
  Patch,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AttendanceService } from './attendance.service';
import { Public } from '../../meta';
import { AttendanceDto, GetAttendanceQueryParams } from '../../dtos';
import { UserSchema } from '../user/user.schema';

@ApiTags('')
@Controller('')
export class AttendanceController {
  constructor(private AttendanceService: AttendanceService) {}

  @Post('/attendance')
  addAttendance(@Body() AttendanceDto: AttendanceDto): any {
    console.log('AttendanceDto', AttendanceDto);
    // return AttendanceDto;
    return this.AttendanceService.saveAttendance(AttendanceDto);
  }
  @Get('/attendance')
  async getAttendance(@Query() query: GetAttendanceQueryParams): Promise<any> {
    console.log('query', query);
    return await this.AttendanceService.getAttendance(query);
  }

  // @Get('/attendance')
  // findAll(): string {
  //   return 'This action returns all attendance';
  // }

  @Delete('/attendance/:id')
  async deleteAttemdance(@Param('id') id: string): Promise<any> {
    return this.AttendanceService.deleteAttendance(id);
  }
  @Put('/attendance/:id')
  async updateAttendance(
    @Param('id') id: string,
    @Body() attendance: AttendanceDto,
  ): Promise<any> {
    return this.AttendanceService.updateAttendance(id, attendance);
  }
}
