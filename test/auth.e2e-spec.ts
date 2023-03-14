import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { CreateUserDto } from '../src/api/user/dto/create-user.dto';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let server: any;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    server = app.getHttpServer();
  });

  describe('POST /auth/register', () => {
    const createUserDto: CreateUserDto = {
      email: 'email10@domain.com',
      password: 'password',
    };
    it('should register and return the user', async () => {
      const res = await request(server)
        .post('/auth/register')
        .send(createUserDto);

      expect(res.statusCode).toEqual(201);
      expect(typeof res.body.id).toEqual('string');
      expect(res.body.email).toEqual(createUserDto.email);
      expect(res.body.password).toBeUndefined();
    });

    it('should register and logs in the user', async () => {
      const res = await request(server)
        .post('/auth/register')
        .send(createUserDto);

      const cookies = res.get('Set-Cookie');

      expect(res.statusCode).toEqual(201);
      expect(cookies.length).toBeGreaterThan(0);
    });
  });
});
