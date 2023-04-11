import { ConfigModule, ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import configs from 'src/configs';

describe('ConfigService', () => {
  let configService: ConfigService;

  beforeAll(async () => {
    const modRef = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          load: configs,
          isGlobal: true,
          cache: true,
          envFilePath: ['.env.test'],
          expandVariables: true,
        }),
      ],
    }).compile();

    configService = modRef.get(ConfigService);

    await modRef.init();
  });

  afterEach(async () => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(configService).toBeDefined();
  });

  describe('get', () => {
    it('should get app name', () => {
      const appName = configService.get<string>('app.name');
      expect(appName).toMatch(/Nestjs_book_shop_test/);
    });
  });
});
