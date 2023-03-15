import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../user/user.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

describe('AuthController', () => {
  let controller: AuthController;
  let fakeAuthService: Partial<AuthService>;
  let fakeUserService: Partial<UserService>;

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

    fakeUserService = {
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
          provide: UserService,
          useValue: fakeUserService,
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

      expect(res).toEqual({
        id: '1',
        email: 'email@domain.com',
        password: 'asd.asd',
      });
      expect(session).toHaveProperty('id');
      expect(session.id).toEqual('1');
    });
  });
});
