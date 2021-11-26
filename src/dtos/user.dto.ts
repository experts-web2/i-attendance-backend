import { ApiPropertyOptional } from '@nestjs/swagger';
export class UserDto {
  name: string;
  email: string;
  phone: string;
  password: string;
  city: string;
  center: string;
  verified?: boolean;
  deleted?: boolean;
}

export class UserLoginDto {
  email: string;
  password: string;
}

export class UserLoginResponseDto {
  user: Omit<UserDto, 'password'>;
  token: string;
}

export class ChangePasswordDto {
  email: string;
  oldPassword: string;
  newPassword: string;
}

export class GetUsersQueryParams {
  @ApiPropertyOptional()
  city: string;

  @ApiPropertyOptional()
  center: string;
}
