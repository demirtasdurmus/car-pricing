import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UsersService } from '../users/users.service';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';
import { LoginDto } from './dto/login.dto';
import { User } from '../users/user.entity';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  async register(createUserDto: CreateUserDto): Promise<User> {
    const users = await this.usersService.find(createUserDto.email);
    if (users.length) {
      throw new BadRequestException('Email in use');
    }

    // salt
    const salt = randomBytes(8).toString('hex');

    // hash
    const hash = (await scrypt(createUserDto.password, salt, 32)) as Buffer;

    // join
    const result = salt + '.' + hash.toString('hex');

    return this.usersService.create({
      email: createUserDto.email,
      password: result,
    });
  }

  async login(loginUserDto: LoginDto): Promise<User> {
    const [user] = await this.usersService.find(loginUserDto.email);

    if (!user) {
      throw new BadRequestException('Incorrect credentials');
    }

    const [salt, storedHash] = user.password.split('.');

    const hash = (await scrypt(loginUserDto.password, salt, 32)) as Buffer;

    if (storedHash !== hash.toString('hex')) {
      throw new BadRequestException('Incorrect credentials');
    }
    return user;
  }
}
