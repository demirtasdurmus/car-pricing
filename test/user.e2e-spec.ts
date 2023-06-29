import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { Repository } from 'typeorm';
import { User } from '../src/modules/user/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('UserController (e2e)', () => {
  let app: INestApplication;
  let server: any;
  let userRepository: Repository<User>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    server = app.getHttpServer();

    userRepository = app.get(getRepositoryToken(User));
  });

  beforeEach(async () => {
    await userRepository.delete({});
  });

  afterAll(async () => {
    await userRepository.delete({});
    await app.close();
  });

  describe('GET /users/:id', () => {
    it('should return undefined if a user with particular id does not exist', async () => {
      const res = await request(server).get(
        '/users/af7c1fe6-d669-414e-b066-e9733f0de7a8',
      );

      expect(res.statusCode).toEqual(200);
      expect(res.body.id).toEqual(undefined);
    });
  });
});
