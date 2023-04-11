import { INestApplication } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { useContainer } from 'class-validator';
import { CommonModule } from 'src/common/common.module';
import { RoutesPublicModule } from 'src/router/routes/routes.public.module';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { faker } from '@faker-js/faker';
import { UserService } from 'src/modules/user/services/user.service';

describe('E2E User Public', () => {
  let app: INestApplication;
  let userService: UserService;
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
    userService = app.get(UserService);

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

  it(`POST sign-up Error Request`, async () => {
    const { body } = await request(app.getHttpServer())
      .post('/public/user/sign-up')
      .set('Content-Type', 'application/json')
      .send({});
    expect(body.message).toMatch(/request.validation/);
  });

  it(`POST sign-up Error passwordConfirm not match`, async () => {
    const { body } = await request(app.getHttpServer())
      .post('/public/user/sign-up')
      .set('Content-Type', 'application/json')
      .send({ ...userData, passwordConfirm: '999999' });
    expect(body.message).toMatch(/request.validation/);
    expect(body.errors[0].constraints.passwordConfirmMatch).toMatch(
      /Passwords do not match/,
    );
  });
});
