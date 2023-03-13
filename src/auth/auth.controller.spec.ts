import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../users/users.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

describe('AuthController', () => {
  let controller: AuthController;
  let fakeAuthService: Partial<AuthService>;
  let fakeUsersService: Partial<UsersService>;

  beforeEach(async () => {
    fakeAuthService = {
      async login(loginDto: LoginDto) {
        return {
          id: '1',
          email: loginDto.email,
          password: 'asd.asd',
        };
      },
    };

    fakeUsersService = {
      async find(email: string) {
        return [
          {
            id: '1',
            email: email,
            password: 'asd.asd',
          },
        ];
      },
    };
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: fakeAuthService,
        },
        {
          provide: UsersService,
          useValue: fakeUsersService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('Login', () => {
    const loginDto: LoginDto = {
      email: 'email@domain.com',
      password: 'asd',
    };
    it('should update session object and return success', async () => {
      const session: any = {};
      const res = await controller.login(loginDto, session);

      expect(res).toEqual({ message: 'success' });
      expect(session).toHaveProperty('id');
      expect(session.id).toEqual('1');
    });
  });
});
