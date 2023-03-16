import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { UserController } from './user.controller';

describe('UserController', () => {
  let controller: UserController;
  let fakeUserService: Partial<UserService>;

  beforeEach(async () => {
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
          id: '1',
          email: 'email@domain.com',
          password: 'asd.asd',
        },
      ]);
    });
  });
});
