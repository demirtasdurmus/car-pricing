import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { UserService } from '../user/user.service';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';
import { LoginDto } from './dto/login.dto';
import { User } from '../user/user.entity';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  async register(createUserDto: CreateUserDto): Promise<User> {
    const users = await this.userService.find(createUserDto.email);
    if (users.length) {
      throw new BadRequestException('Email in use');
    }

    // salt
    const salt = randomBytes(8).toString('hex');

    // hash
    const hash = (await scrypt(createUserDto.password, salt, 32)) as Buffer;

    // join
    const result = salt + '.' + hash.toString('hex');

    return this.userService.create({
      firstName: createUserDto.firstName,
      lastName: createUserDto.lastName,
      email: createUserDto.email,
      password: result,
    });
  }

  async login(loginUserDto: LoginDto): Promise<User> {
    const [user] = await this.userService.find(loginUserDto.email);

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
