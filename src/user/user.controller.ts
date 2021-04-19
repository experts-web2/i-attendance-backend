import { Controller, Post, Body } from '@nestjs/common';
import { IUserLogin, IUserLoginResponse } from './user.model';
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
}
