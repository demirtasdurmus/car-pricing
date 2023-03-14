import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('UserController (e2e)', () => {
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

  describe('GET /users/:id', () => {
    it('should return undefined if a user with particular id does not exist', async () => {
      const res = await request(server).get('/users/invalid-id');

      expect(res.statusCode).toEqual(200);
      expect(res.body.id).toEqual(undefined);
    });
  });
});
