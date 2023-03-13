import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Session,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/current-user.decaorator';
import { LoginDto } from './dto/login.dto';
import { Serialize } from '../interceptors/serialize.interceptor';
import { UserDto } from '../users/dto/user-dto';
import { AuthGuard } from '../guards/auth.guard';
import { User } from 'src/users/user.entity';

@Serialize(UserDto)
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(
    @Body() createUserDto: CreateUserDto,
    @Session() session: any,
  ): Promise<User> {
    const user = await this.authService.register(createUserDto);
    session.id = user.id;
    return user;
  }

  @Post('login')
  @HttpCode(200)
  async login(
    @Body() loginDto: LoginDto,
    @Session() session: any,
  ): Promise<User> {
    const user = await this.authService.login(loginDto);
    session.id = user.id;
    return user;
  }

  @Get('check-auth')
  async checkAuth(@Session() session: any): Promise<object> {
    return session;
  }

  @Get('whoami')
  @UseGuards(AuthGuard)
  whoami(@CurrentUser() data: any) {
    return data;
  }

  @Get('logout')
  async logout(@Session() session: any): Promise<{ message: 'success' }> {
    session.id = null;
    return { message: 'success' };
  }
}
