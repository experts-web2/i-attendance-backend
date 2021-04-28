import { Controller, Post, Body, Get, Param, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { Public } from '../meta';
import {
  UserDto,
  UserLoginDto,
  UserLoginResponseDto,
  ChangePasswordDto,
  GetUsersQueryParams,
} from '../dtos';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private service: UserService) {}

  @Public()
  @Post('login')
  async logIn(@Body() data: UserLoginDto): Promise<UserLoginResponseDto> {
    return await this.service.logIn(data);
  }

  @Public()
  @Post('sign-up')
  async signUp(@Body() user: UserDto): Promise<boolean> {
    return await this.service.signUp(user);
  }

  @Public()
  @Get('forgot-password/:email')
  async forgotPassword(@Param('email') email: string): Promise<boolean> {
    return await this.service.forgotPassword(email);
  }

  @Post('change-password')
  async changePassword(@Body() payload: ChangePasswordDto): Promise<boolean> {
    return await this.service.changePassword(payload);
  }

  @Get('')
  async getUsers(@Query() query: GetUsersQueryParams): Promise<UserDto[]> {
    return await this.service.getUsers(query);
  }
}
