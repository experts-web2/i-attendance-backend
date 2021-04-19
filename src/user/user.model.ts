import { User } from './user.schema';

export interface IUserLogin {
  email: string;
  password: string;
}

export interface IUserLoginResponse {
  user: Omit<User, 'password'>;
  token: string;
}
