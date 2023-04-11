import { INestApplication } from '@nestjs/common';
import { useContainer } from 'class-validator';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from 'src/app/app.module';

describe('E2E User Public', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const modRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = modRef.createNestApplication();
    useContainer(app.select(AppModule), { fallbackOnErrors: true });

    await app.init();
  });

  afterAll(async () => {
    jest.clearAllMocks();
    await app.close();
  });

  it(`GET hello successful`, async () => {
    const { body } = await request(app.getHttpServer()).get('/hello');
    expect(body.statusCode).toBe(200);
  });
});
