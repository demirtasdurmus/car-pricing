import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { EURole, EUStatus, User } from '../user/user.entity';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

describe('AuthService', () => {
  let users: User[] = [];
  let service: AuthService;
  let fakeUserService: Partial<UserService>;

  beforeEach(async () => {
    fakeUserService = {
      find(email: string) {
        const filtered = users.filter((user: User) => user.email === email);
        return Promise.resolve(filtered);
      },
      create(createUserDto: CreateUserDto) {
        const user: User = {
          id: Math.random().toString().split('.')[1],
          firstName: createUserDto.firstName,
          lastName: createUserDto.lastName,
          email: createUserDto.email,
          password: createUserDto.password,
          status: EUStatus.ACTIVE,
          roles: EURole.USER,
          createdAt: new Date(),
          updatedAt: new Date(),
          reports: [],
        };
        users.push(user);
        return Promise.resolve(user);
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: fakeUserService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    users = [];
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  const createUserDto: CreateUserDto = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'email@domain.com',
    password: 'password',
  };
  describe('Register', () => {
    it('should create a new user and return id and roles', async () => {
      const user = await service.register(createUserDto);

      expect(user.id).toBeDefined();
      expect(user.roles).toBeDefined();
      expect(typeof user.id).toEqual('string');
    });

    it('should throw an error if user registers with email that is in use', async () => {
      await service.register(createUserDto);
      const register = service.register(createUserDto);

      await expect(register).rejects.toThrow(BadRequestException);
    });
  });

  describe('Login', () => {
    it('should throw an error if you login with a non-existent email', async () => {
      const loginDto: LoginDto = {
        email: 'non-existent@domain.com',
        password: 'password',
      };
      const login = service.login(loginDto);

      expect(login).rejects.toThrow(BadRequestException);
    });

    it('should throw an error if an invalid password is provided', async () => {
      await service.register(createUserDto);

      const loginDto: LoginDto = {
        email: 'email@domain.com',
        password: 'invalid-password',
      };
      const login = service.login(loginDto);

      expect(login).rejects.toThrow(BadRequestException);
    });

    it('should return user if a valid password is provided', async () => {
      await service.register(createUserDto);

      const loginDto: LoginDto = {
        email: 'email@domain.com',
        password: 'password',
      };
      const user = await service.login(loginDto);

      expect(user).toBeDefined();
    });
  });
});
