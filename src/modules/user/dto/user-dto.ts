import { Expose } from 'class-transformer';
import { Role } from '../user.entity';

export class UserDto {
  @Expose()
  id: number;

  @Expose()
  email: string;

  @Expose()
  roles: Role;
}
