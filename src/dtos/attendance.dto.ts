import { ApiPropertyOptional } from '@nestjs/swagger';
import { Document } from 'mongoose';
export class AttendanceDto {
  newMembers: any;
  employees: any;
  nonEmployees: any;
  city: any;
  center: any;
  role: any;
  date: any;
}

export class GetAttendanceQueryParams {
  @ApiPropertyOptional()
  city: any;

  @ApiPropertyOptional()
  center: any;

  @ApiPropertyOptional()
  startDate: any;

  @ApiPropertyOptional()
  endDate: any;

  @ApiPropertyOptional()
  role: any;
}
