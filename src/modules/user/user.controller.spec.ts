import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { EURole, EUStatus, User } from './user.entity';

describe('UserController', () => {
  let controller: UserController;
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
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: fakeUserService,
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('Login', () => {
    it('should update session object and return success', async () => {
      const res = await controller.getAll('email@domain.com');

      expect(res).toEqual([
        {
          email: 'email@domain.com',
          ...mockUser,
        },
      ]);
    });
  });
});
