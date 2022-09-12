import {
  BadRequestException,
  Injectable,
  NotFoundException,
  NotAcceptableException,
} from '@nestjs/common';
import { Model } from 'mongoose';

import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { MailerService } from '@nestjs-modules/mailer';
import { Attendance, AttendanceDocument } from './attendance.schema';
import { AttendanceDto, GetAttendanceQueryParams } from '../../dtos';
const moment = require('moment');
@Injectable()
export class AttendanceService {
  constructor(
    @InjectModel('AttendanceDto') private model: Model<AttendanceDocument>,
  ) {}
  // attendance: AttendanceDto[] = [];
  data: any;

  async saveAttendance(AttendanceDto: any) {
    try {
      console.log('DTOOO', AttendanceDto);
      const newAttendance = new this.model(AttendanceDto);
      console.log('newAttendance', newAttendance);
      const result = await newAttendance.save();
      console.log('result', result);
      return result;
    } catch (error) {
      return error;
    }
  }

  async getAttendance(params: GetAttendanceQueryParams) {
    console.log('params', params);
    try {
      let query = this.model.find({ deleted: false });
      if (params.city) query = query.where('city').equals(params.city);
      if (params.center) query = query.where('center').equals(params.center);
      if (params.role) query = query.where('role').equals(params.role);
      if (params.startDate) {
        const start = new Date(params.startDate).toISOString();
        const end = new Date(params.endDate).toISOString();
        console.log('start', start);
        console.log('end', end);

        const query1 = {
          Date: {
            $gte: start,
            $lte: end,
          },
          leave: { $exists: false },
        };
        console.log('query1', query1);
        const data = await this.model.find(query1);
        console.log('data', data);
        return data;
      }
      // Fitlerbydate = (req, res) => {
      //   User.find(query, function (err, data) {
      //     if (err) {
      //       return res.status(300).json('Error');
      //     } else {
      //       return res.status(200).json({ data: data });
      //     }
      //   });
      // };
      const attendance = await query
        .lean()
        .populate('city')
        .populate('center')
        .exec();
      return attendance;
    } catch (error) {
      throw new BadRequestException(null, 'Not Found');
    }
  }
  async deleteAttendance(_id: string): Promise<any> {
    try {
      const attendance = await this.model.deleteOne({ _id });
      return attendance;
    } catch (error) {
      return 'Error in Delete Attendance';
    }
  }

  async updateAttendance(id: string, attendance: AttendanceDto): Promise<any> {
    try {
      const attendanceResult = await this.model.findByIdAndUpdate(
        id,
        attendance,
      );
      console.log('attendanceResult', attendanceResult);
      return attendanceResult;
    } catch {
      throw new BadRequestException(null, 'Not Found');
    }
  }
}
