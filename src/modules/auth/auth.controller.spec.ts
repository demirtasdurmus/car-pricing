import { Test, TestingModule } from '@nestjs/testing';
import { EURole, EUStatus, User } from '../user/user.entity';
import { UserService } from '../user/user.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

describe('AuthController', () => {
  let controller: AuthController;
  let fakeAuthService: Partial<AuthService>;
  let fakeUserService: Partial<UserService>;

  const mockUser: User = {
    id: '1',
    firstName: 'firstName',
    lastName: 'lastName',
    email: '',
    password: 'asd.asd',
    status: EUStatus.ACTIVE,
    roles: EURole.USER,
    createdAt: new Date(),
    updatedAt: new Date(),
    reports: [],
  };

  beforeEach(async () => {
    fakeAuthService = {
      async login(loginDto: LoginDto) {
        return {
          id: mockUser.id,
          roles: mockUser.roles,
        };
      },
    };

    fakeUserService = {
      async find(email: string) {
        return [
          {
            email: email,
            ...mockUser,
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
    it('should update session object and return session user', async () => {
      const session: any = {};
      const res = await controller.login(loginDto, session);

      expect(res).toEqual({
        id: mockUser.id,
        roles: mockUser.roles,
      });
      expect(session).toHaveProperty('user');
      expect(session.user.id).toEqual('1');
    });
  });
});
