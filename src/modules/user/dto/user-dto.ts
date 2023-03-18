import { Expose, Transform, TransformFnParams } from 'class-transformer';
import { EURole } from '../user.entity';

export class UserDto {
  @Expose()
  id: number;

  @Expose()
  firstName: string;

  @Expose()
  lastName: string;

  @Expose()
  email: string;

  @Expose()
  @Transform((data: TransformFnParams) => JSON.parse(data.value))
  roles: EURole;
}
