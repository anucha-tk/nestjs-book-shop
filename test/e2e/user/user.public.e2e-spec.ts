import { INestApplication } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { useContainer } from 'class-validator';
import { CommonModule } from 'src/common/common.module';
import { RoutesPublicModule } from 'src/router/routes/routes.public.module';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { faker } from '@faker-js/faker';
import { E2E_USER } from './user.constant';

describe('E2E User Public', () => {
  let app: INestApplication;
  let userData: Record<string, any>;

  const password = '123456';

  beforeAll(async () => {
    const modRef = await Test.createTestingModule({
      imports: [
        CommonModule,
        RoutesPublicModule,
        RouterModule.register([
          {
            path: '/public',
            module: RoutesPublicModule,
          },
        ]),
      ],
    }).compile();

    app = modRef.createNestApplication();
    useContainer(app.select(CommonModule), { fallbackOnErrors: true });

    userData = {
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      password,
      passwordConfirm: password,
      email: faker.internet.email(),
      mobileNumber: faker.phone.number('62812#########'),
      username: faker.internet.userName(),
    };

    await app.init();
  });

  afterAll(async () => {
    jest.clearAllMocks();
    //TODO: delete user many
    await app.close();
  });

  describe('POST Signup', () => {
    it(`should error when empty`, async () => {
      const { body } = await request(app.getHttpServer())
        .post(E2E_USER.PUBLIC_SIGNUP)
        .set('Content-Type', 'application/json')
        .send({});
      expect(body.message).toMatch(/request.validation/);
    });

    it(`should error when passwordConfirm not match`, async () => {
      const { body } = await request(app.getHttpServer())
        .post(E2E_USER.PUBLIC_SIGNUP)
        .set('Content-Type', 'application/json')
        .send({ ...userData, passwordConfirm: '999999' });
      expect(body.message).toMatch(/request.validation/);
      expect(body.errors[0].constraints.passwordConfirmMatch).toMatch(
        /Passwords do not match/,
      );
    });

    it('should return accessToken and refreshToken when successful', async () => {
      const { body } = await request(app.getHttpServer())
        .post(E2E_USER.PUBLIC_SIGNUP)
        .set('Content-Type', 'application/json')
        .send(userData);

      expect(body.statusCode).toBe(201);
      expect(body.message).toMatch(/sign up success/i);
      expect(body.data.accessToken).toBeDefined();
      expect(body.data.refreshToken).toBeDefined();
    });
  });
});
