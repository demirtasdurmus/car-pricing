import { Injectable } from '@nestjs/common';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UsersService } from '../users/users.service';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  async register(createUserDto: CreateUserDto): Promise<void> {
    // salt
    const salt = randomBytes(8).toString('hex');

    // hash
    const hash = (await scrypt(createUserDto.password, salt, 32)) as Buffer;

    // join
    const result = salt + '.' + hash.toString('hex');

    // reassign
    createUserDto.password = result;

    return this.usersService.create(createUserDto);
  }
}
