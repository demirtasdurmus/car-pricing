import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { User } from '../users/user.entity';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

describe('AuthService', () => {
  let service: AuthService;
  let fakeUsersService: Partial<UsersService>;

  beforeEach(async () => {
    const users: User[] = [];
    fakeUsersService = {
      find(email: string) {
        const filtered = users.filter((user: User) => user.email === email);
        return Promise.resolve(filtered);
      },
      create(createUserDto: CreateUserDto) {
        const user = {
          id: Math.random().toString().split('.')[1],
          email: createUserDto.email,
          password: createUserDto.password,
        };
        users.push(user);
        return Promise.resolve(user);
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: fakeUsersService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  const createUserDto: CreateUserDto = {
    email: 'email@domain.com',
    password: 'password',
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('Register', () => {
    it('should create a new user with a salted and hashed password', async () => {
      const user = await service.register(createUserDto);
      expect(user.password).not.toEqual(createUserDto.password);
      const [salt, hash] = user.password.split('.');
      expect(salt).toBeDefined();
      expect(hash).toBeDefined();
    });

    it('should throw an error if user registers with email that is in use', async () => {
      await service.register(createUserDto);
      const register = service.register(createUserDto);
      await expect(register).rejects.toThrow(BadRequestException);
    });
  });

  describe('Login', () => {
    const loginDto: LoginDto = {
      email: 'email@domain.com',
      password: 'password',
    };
    it('should throw an error if you login with a non-existent email', async () => {
      const login = service.login(loginDto);
      expect(login).rejects.toThrow(BadRequestException);
    });

    it('should throw an error if an invalid password is provided', async () => {
      createUserDto.password = 'invalid-password';
      await service.register(createUserDto);
      const login = service.login(loginDto);
      expect(login).rejects.toThrow(BadRequestException);
    });

    it('should return user if a valid password is provided', async () => {
      await service.register(loginDto);
      const user = await service.login(loginDto);
      expect(user).toBeDefined();
    });
  });
});
