import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { App } from 'supertest/types';

import { UsersService } from '../src/users/users.service';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let token: string;
  let usersService: UsersService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    usersService = moduleFixture.get<UsersService>(UsersService);
    await app.init();
  });

  beforeEach(async () => {
    // Create admin user before each test
    const adminUser = await usersService.findOne('admin@admin.com');
    if (!adminUser) {
      await usersService.create('admin@admin.com', 'admin');
    }
  });

  afterAll(async () => {
    await app.close();
  });

  it('should sign up a new user', async () => {
    const email = 'test@test.com';
    const password = 'password';

    const response = await request(app.getHttpServer())
      .post('/api/auth/signup')
      .send({ email, password })
      .expect(201);

    expect(response.body).toHaveProperty('access_token');
  });

  it('should log in an existing user', async () => {
    const email = 'admin@admin.com';
    const password = 'admin';

    const response = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({ email, password })
      .expect(201);

    expect(response.body).toHaveProperty('access_token');
    token = response.body.access_token;
  });

  it('should not access protected route without token', async () => {
    return request(app.getHttpServer()).get('/api/messages').expect(401);
  });

  it('should access protected route with token', async () => {
    return request(app.getHttpServer())
      .get('/api/messages')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
  });
});
