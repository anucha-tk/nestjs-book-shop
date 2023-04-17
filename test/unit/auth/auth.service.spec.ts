import { ConfigModule, ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { AuthModule } from 'src/common/auth/auth.module';
import { AuthService } from 'src/common/auth/services/auth.service';
import { HelperModule } from 'src/common/helper/helper.module';
import { HelperDateService } from 'src/common/helper/services/helper.date.service';
import { HelperHashService } from 'src/common/helper/services/helper.hash.service';
import configs from 'src/configs';

describe('auth.service', () => {
  let configService: ConfigService;
  let authService: AuthService;
  let helperHashService: HelperHashService;
  let helperDateService: HelperDateService;
  let passwordExpiredInMs: number;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          load: configs,
          isGlobal: true,
          cache: true,
          envFilePath: ['.env'],
          expandVariables: true,
        }),
        HelperModule,
        AuthModule,
      ],
    }).compile();

    configService = moduleRef.get<ConfigService>(ConfigService);
    authService = moduleRef.get<AuthService>(AuthService);
    helperHashService = moduleRef.get<HelperHashService>(HelperHashService);
    helperDateService = moduleRef.get<HelperDateService>(HelperDateService);
    passwordExpiredInMs = configService.get<number>(
      'auth.password.expiredInMs',
    );
  });

  afterEach(async () => {
    jest.clearAllMocks();
  });

  it('create password', async () => {
    const spyRandomSalt = jest.spyOn(helperHashService, 'randomSalt');
    const spyBcrypt = jest.spyOn(helperHashService, 'bcrypt');
    const spyForwardIM = jest.spyOn(helperDateService, 'forwardInMilliseconds');

    const password = '123456';
    const result = await authService.createPassword(password);

    expect(spyRandomSalt).toHaveBeenCalledTimes(1);
    expect(spyBcrypt).toHaveBeenCalledTimes(1);
    expect(spyForwardIM).toHaveBeenCalledTimes(1);
    expect(spyForwardIM).toBeCalledWith(passwordExpiredInMs);
    expect(result.passwordHash).not.toEqual(password);
    expect(result).toHaveProperty('passwordHash');
    expect(result).toHaveProperty('passwordExpired');
    expect(result).toHaveProperty('salt');
  });
});
