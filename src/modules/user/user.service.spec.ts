import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.entity';
import { UserService } from './user.service';

describe('AuthService', () => {
  let service: UserService;
  let mockRepository: any;

  beforeEach(async () => {
    const users: User[] = [];
    mockRepository = jest.fn(() => ({
      metadata: {
        columns: [],
        relations: [],
      },
      async create(createUserDto: CreateUserDto) {
        return {
          id: Math.random().toString().split('.')[1],
          email: createUserDto.email,
          password: createUserDto.password,
        };
      },
      async save(user: User) {
        users.push(user);
        return user;
      },
    }));

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: getRepositoryToken(User), useClass: mockRepository },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('Create', () => {
    const createUserDto: CreateUserDto = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'email@domain.com',
      password: 'password.hashed-salted',
    };
    it('should create a new user', async () => {
      const user = await service.create(createUserDto);
      expect(user.email).toEqual(createUserDto.email);
      expect(user.password).toEqual(createUserDto.password);
      const [salt, hash] = user.password.split('.');
      expect(salt).toBeDefined();
      expect(hash).toBeDefined();
    });
  });
});
