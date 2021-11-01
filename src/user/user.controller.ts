import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import {
  IChangePasswordRequest,
  IUserLogin,
  IUserLoginResponse,
} from './user.model';
import { User } from './user.schema';
import { UserService } from './user.service';
import { Public } from '../meta';

@Controller('user')
export class UserController {
  constructor(private service: UserService) {}

  @Public()
  @Post('login')
  async logIn(@Body() data: IUserLogin): Promise<IUserLoginResponse> {
    return await this.service.logIn(data);
  }

  @Public()
  @Post('sign-up')
  async signUp(@Body() user: User): Promise<boolean> {
    return await this.service.signUp(user);
  }

  @Post('change-password')
  async changePassword(
    @Body() payload: IChangePasswordRequest,
  ): Promise<boolean> {
    return await this.service.changePassword(payload);
  }

  @Public()
  @Get('forgot-password/:email')
  async forgotPassword(@Param('email') email: string): Promise<boolean> {
    return await this.service.forgotPassword(email);
  }
}
