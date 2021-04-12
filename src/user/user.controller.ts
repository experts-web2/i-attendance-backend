import { Controller, Post } from '@nestjs/common';

@Controller('user')
export class UserController {
  constructor() {
    console.log('Constructor');
  }

  @Post('login')
  logIn(): null {
    return null;
  }

  @Post('sign-up')
  signUp(): null {
    return null;
  }
}
