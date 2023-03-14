import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = this.userRepo.create(createUserDto);
    try {
      return await this.userRepo.save(user);
    } catch (error) {
      if (error.errno === 19) {
        throw new ConflictException('User already exists.');
      }
      throw error;
    }
  }

  async findOne(id: string): Promise<User> {
    return this.userRepo.findOneBy({ id });
  }

  async find(email: string): Promise<User[]> {
    return this.userRepo.find({ where: { email } });
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);
    if (!user) throw new NotFoundException('User not found.');

    Object.assign(user, updateUserDto);
    return this.userRepo.save(user);
  }

  async delete(id: string): Promise<User> {
    const user = await this.findOne(id);
    if (!user) throw new NotFoundException('User not found.');

    return this.userRepo.remove(user);
  }
}
