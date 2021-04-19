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
import { User, UserDocument } from './user.schema';
import { IUserLogin, IUserLoginResponse } from './user.model';
@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private model: Model<UserDocument>,
    private jwtService: JwtService,
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
    } catch (error) {}
  }

  async logIn({ email, password }: IUserLogin): Promise<IUserLoginResponse> {
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
      console.log({ error });
    }
  }

  async signUp(user: User): Promise<boolean> {
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
      console.log({ error });
    }
  }
}
