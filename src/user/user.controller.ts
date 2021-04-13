import { Controller, Post, Body } from '@nestjs/common';
import { IUserLogin } from './user.model';
import { User } from './user.schema';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private service: UserService) {}

  @Post('login')
  async logIn(@Body() data: IUserLogin): Promise<Omit<User, 'password'>> {
    return await this.service.logIn(data);
  }

  @Post('sign-up')
  async signUp(@Body() user: User): Promise<boolean> {
    return await this.service.signUp(user);
  }
}
