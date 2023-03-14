import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Query,
} from '@nestjs/common';
import { Serialize } from '../../interceptors/serialize.interceptor';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserDto } from './dto/user-dto';
import { User } from './user.entity';
import { UserService } from './user.service';

@Serialize(UserDto)
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/:id')
  async getOne(@Param('id') id: string): Promise<User> {
    return this.userService.findOne(id);
  }

  @Get()
  async getAll(@Query('email') email: string): Promise<User[]> {
    return this.userService.find(email);
  }

  @Patch('/:id')
  async updateOne(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return this.userService.update(id, updateUserDto);
  }

  @Delete('/:id')
  async deleteOne(@Param('id') id: string): Promise<User> {
    return this.userService.delete(id);
  }
}
