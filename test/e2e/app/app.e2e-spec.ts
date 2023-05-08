import { INestApplication } from '@nestjs/common';
import { useContainer } from 'class-validator';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from 'src/app/app.module';
import { ApiKeyService } from 'src/common/api-key/services/api-key.service';
import { ENUM_API_KEY_TYPE } from 'src/common/api-key/constants/api-key.enum.constant';

describe('E2E User Public', () => {
  let app: INestApplication;
  let apiKeyService: ApiKeyService;
  const apiKey = ['abc', 'xyz'];

  beforeAll(async () => {
    const modRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = modRef.createNestApplication();
    useContainer(app.select(AppModule), { fallbackOnErrors: true });
    apiKeyService = app.get<ApiKeyService>(ApiKeyService);

    await apiKeyService.createRaw({
      name: 'Api Key Migration',
      type: ENUM_API_KEY_TYPE.PUBLIC,
      key: apiKey[0],
      secret: apiKey[1],
    });
    await app.init();
  });

  afterAll(async () => {
    jest.clearAllMocks();
    await apiKeyService.deleteMany({});
    await app.close();
  });

  it(`GET hello successful`, async () => {
    const { body } = await request(app.getHttpServer()).get('/hello');
    expect(body.statusCode).toBe(200);
  });

  it('should return 200 /hello/api-key', async () => {
    const { body } = await request(app.getHttpServer())
      .get('/hello/api-key')
      .set('x-api-key', `${apiKey[0]}:${apiKey[1]}`);

    expect(body.statusCode).toBe(200);
  });
});
