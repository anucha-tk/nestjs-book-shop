import { ConfigModule } from '@nestjs/config';
import { DatabaseOptionsService } from 'src/common/database/services/database.options.services';
import { Test } from '@nestjs/testing';
import configs from 'src/configs';
import { DatabaseOptionsModule } from 'src/common/database/database.module';
import { MongooseModuleOptions } from '@nestjs/mongoose';

describe('DatabaseOptionsService', () => {
  let databaseOptionsService: DatabaseOptionsService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          load: configs,
          isGlobal: true,
          cache: true,
          envFilePath: ['.env.test'],
          expandVariables: true,
        }),
        DatabaseOptionsModule,
      ],
    }).compile();

    databaseOptionsService = moduleRef.get<DatabaseOptionsService>(
      DatabaseOptionsService,
    );
  });

  afterEach(async () => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(databaseOptionsService).toBeDefined();
  });

  describe('createOptions development', () => {
    beforeEach(async () => {
      await Test.createTestingModule({
        imports: [
          ConfigModule.forRoot({
            load: configs,
            isGlobal: true,
            cache: true,
            envFilePath: ['.env.test'],
            expandVariables: true,
          }),
          DatabaseOptionsModule,
        ],
      }).compile();
    });

    it('should be return mongoose options', async () => {
      const result: MongooseModuleOptions =
        databaseOptionsService.createOptions();

      jest
        .spyOn(databaseOptionsService, 'createOptions')
        .mockReturnValueOnce(result);

      expect(result).toBeDefined();
      expect(result).toBeTruthy();
      expect(result.uri).toMatch('mongodb://localhost:27017/nestjs-book-shop');
      expect(result.auth.username).toMatch('nestjsbookshop-db-user');
      expect(result.auth.username).toMatch('nestjsbookshop');
    });
  });
});
