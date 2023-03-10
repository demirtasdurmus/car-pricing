import { Body, Controller, Get, HttpCode, Post, Session } from '@nestjs/common';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(
    @Body() createUserDto: CreateUserDto,
    @Session() session: any,
  ): Promise<{ message: string }> {
    const user = await this.authService.register(createUserDto);
    session.id = user.id;
    return { message: 'success' };
  }

  @Post('login')
  @HttpCode(200)
  async login(
    @Body() loginDto: LoginDto,
    @Session() session: any,
  ): Promise<{ message: string }> {
    const user = await this.authService.login(loginDto);
    session.id = user.id;
    return { message: 'success' };
  }

  @Get('check-auth')
  async checkAuth(@Session() session: any): Promise<object> {
    return session;
  }

  @Get('logout')
  async logout(@Session() session: any): Promise<{ message: 'success' }> {
    session.id = null;
    return { message: 'success' };
  }
}
