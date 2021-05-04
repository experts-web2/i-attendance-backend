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
import { User, UserDocument } from './user.schema';
import {
  UserDto,
  UserLoginDto,
  UserLoginResponseDto,
  ChangePasswordDto,
  GetUsersQueryParams,
} from '../dtos';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private model: Model<UserDocument>,
    private jwtService: JwtService,
    private readonly mailerService: MailerService,
  ) {}

  async validateUser(
    username: string,
    password: string,
  ): Promise<Omit<User, 'password'>> | null {
    try {
      const user = await this.model.findOne({ email: username });
      if (!user) throw new NotFoundException(null, 'User Not Found');
      const isPasswordMatched = await bcrypt.compare(password, user.password);
      if (isPasswordMatched) {
        const { password, ...rest } = user.toObject();
        return rest;
      } else return null;
    } catch (error) {
      throw new NotFoundException(null, 'User Not Found');
    }
  }

  async logIn({
    email,
    password,
  }: UserLoginDto): Promise<UserLoginResponseDto> {
    try {
      if (!email || !password)
        throw new BadRequestException(null, 'Required Parameters Missing');
      const user = await this.model.findOne({ email });
      if (!user) throw new NotFoundException(null, 'User Not Found');
      const isPasswordMatched = await bcrypt.compare(password, user.password);
      if (isPasswordMatched) {
        const { password, ...rest } = user.toObject();
        const token = this.jwtService.sign({
          username: user.name,
          sub: user._id,
        });
        return { user: rest, token };
      }
    } catch (error) {
      throw new NotFoundException(null, 'User Not Found');
    }
  }

  async signUp(user: UserDto): Promise<boolean> {
    const { name, email, password, phone, city, center } = user;
    try {
      if (!email || !password || !name || !phone || !city || !center)
        throw new BadRequestException(null, 'Required Parameters Missing');
      const existingUser = await this.model.findOne({ email });
      if (existingUser)
        throw new NotAcceptableException(
          null,
          'User With Same Email Already Exist',
        );
      const hash = await bcrypt.hash(password, 10);
      const newUser = new this.model({ ...user, password: hash });
      await newUser.save();
      return true;
    } catch (error) {
      throw new NotFoundException(null, 'User Not Found');
    }
  }

  async changePassword(payload: ChangePasswordDto): Promise<boolean> {
    const { oldPassword, newPassword, email } = payload;
    try {
      const user = await this.model.findOne({ email });
      const oldPasswordMatched = await bcrypt.compare(
        oldPassword,
        user.password,
      );
      if (oldPasswordMatched) {
        const password = await bcrypt.hash(newPassword, 10);
        await this.model.updateOne({ _id: user._id }, { ...user, password });
        return true;
      }
    } catch (error) {
      throw new BadRequestException(null, 'User Not Found');
    }
  }

  // Todo: Nodemailer not actively working
  async forgotPassword(email: string): Promise<boolean> {
    try {
      await this.mailerService.sendMail({
        to: email,
        from: 'test@test.com',
        subject: 'Reset Your Password',
        text: 'Reset Your Password',
      });
      return true;
    } catch (error) {
      throw new BadRequestException(null, 'Not Found');
    }
  }

  async getUsers(
    params: GetUsersQueryParams,
  ): Promise<Omit<UserDto, 'password'>[]> {
    try {
      let query = this.model.find({ deleted: false });
      if (params.city) query = query.where('city').equals(params.city);
      if (params.center) query = query.where('center').equals(params.center);
      const users = await query
        .lean()
        .populate('city')
        .populate('center')
        .exec();
      return users.map(({ password, ...rest }) => ({ ...rest }));
    } catch (error) {
      throw new BadRequestException(null, 'Not Found');
    }
  }

  async deactivateUser(_id: string): Promise<boolean> {
    try {
      await this.model.updateOne({ _id }, { $set: { deleted: true } });
      return true;
    } catch {
      throw new BadRequestException(null, 'Not Found');
    }
  }

  async updateUser(id: string, user: UserDto): Promise<boolean> {
    try {
      await this.model.findByIdAndUpdate(id, user);
      return true;
    } catch {
      throw new BadRequestException(null, 'Not Found');
    }
  }
}
