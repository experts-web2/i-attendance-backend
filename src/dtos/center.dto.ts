import { UserDto } from './user.dto';

export class CenterDto {
  _id?: string;
  name: string;
  city: string;
  managers: UserDto[];
}
