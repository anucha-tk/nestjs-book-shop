import { HttpStatus, INestApplication } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { useContainer } from 'class-validator';
import { CommonModule } from 'src/common/common.module';
import { RoutesPublicModule } from 'src/router/routes/routes.public.module';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { faker } from '@faker-js/faker';
import { E2E_USER } from './user.constant';
import { UserService } from 'src/modules/user/services/user.service';
import { ENUM_USER_STATUS_CODE_ERROR } from 'src/modules/user/constants/user.status-code';

describe('E2E User Public', () => {
  let app: INestApplication;
  let userData: Record<string, any>;
  let userService: UserService;
  const email: string = faker.internet.email();
  const mobileNumber: string = faker.phone.number('62812#########');
  const password = 'y556a0ASB2@@!123';

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
    userService = app.get(UserService);

    userData = {
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      password,
      passwordConfirm: password,
      email,
      mobileNumber,
    };

    await app.init();
  });

  afterAll(async () => {
    jest.clearAllMocks();
    try {
      await userService.deleteMany({
        email: userData.email,
        mobileNumber: userData.mobileNumber,
      });
    } catch (err: any) {
      console.error(err);
    }
    await app.close();
  });

  describe('POST Signup', () => {
    describe('success', () => {
      it('should return success when signup', async () => {
        const { body, status } = await request(app.getHttpServer())
          .post(E2E_USER.PUBLIC_SIGNUP)
          .set('Content-Type', 'application/json')
          .send({ ...userData });

        expect(status).toBe(HttpStatus.CREATED);
        expect(body.statusCode).toBe(201);
        expect(body.message).toMatch('Sign up Success');
      });
    });

    describe('validation', () => {
      beforeAll(async () => {
        await request(app.getHttpServer())
          .post(E2E_USER.PUBLIC_SIGNUP)
          .set('Content-Type', 'application/json')
          .send({
            ...userData,
          });
      });

      it(`should error when empty`, async () => {
        const { body, status } = await request(app.getHttpServer())
          .post(E2E_USER.PUBLIC_SIGNUP)
          .set('Content-Type', 'application/json')
          .send({});

        expect(status).toBe(HttpStatus.UNPROCESSABLE_ENTITY);
        expect(body.message).toBe('Validation errors');
        expect(body._error).toMatch(/request.validation/);
      });

      it(`should error when password not strong`, async () => {
        const { body, status } = await request(app.getHttpServer())
          .post(E2E_USER.PUBLIC_SIGNUP)
          .set('Content-Type', 'application/json')
          .send({
            ...userData,
            password: '123456789',
            passwordConfirm: '123456789',
          });

        expect(status).toBe(HttpStatus.UNPROCESSABLE_ENTITY);
        expect(body.message).toBe('Validation errors');
        expect(body._error).toMatch(/request.validation/);
        expect(body.errors[0].message).toMatch(
          /request.IsPasswordStrongConstraint/i,
        );
      });

      it(`should error when passwordConfirm not match`, async () => {
        const { body, status } = await request(app.getHttpServer())
          .post(E2E_USER.PUBLIC_SIGNUP)
          .set('Content-Type', 'application/json')
          .send({ ...userData, passwordConfirm: '999999' });

        expect(status).toBe(HttpStatus.UNPROCESSABLE_ENTITY);
        expect(body.message).toBe('Validation errors');
        expect(body._error).toMatch(/request.validation/);
        expect(body.errors[0].property).toMatch('passwordConfirm');
      });

      it('should error when email exist', async () => {
        const { body, status } = await request(app.getHttpServer())
          .post(E2E_USER.PUBLIC_SIGNUP)
          .set('Content-Type', 'application/json')
          .send({
            ...userData,
            mobileNumber: faker.phone.number('082#######'),
          });

        expect(status).toBe(HttpStatus.CONFLICT);
        expect(body.statusCode).toBe(
          ENUM_USER_STATUS_CODE_ERROR.USER_EMAIL_EXIST_ERROR,
        );
        expect(body.message).toMatch('Email user used');
      });

      it('should error when mobileNumber exist', async () => {
        const { body, status } = await request(app.getHttpServer())
          .post(E2E_USER.PUBLIC_SIGNUP)
          .set('Content-Type', 'application/json')
          .send({
            ...userData,
            email: faker.internet.email(),
          });
        expect(status).toBe(HttpStatus.CONFLICT);
        expect(body.statusCode).toBe(
          ENUM_USER_STATUS_CODE_ERROR.USER_MOBILE_NUMBER_EXIST_ERROR,
        );
        expect(body.message).toMatch('Mobile Number user used');
      });
    });
  });
});
