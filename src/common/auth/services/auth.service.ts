import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HelperDateService } from 'src/common/helper/services/helper.date.service';
import { HelperEncryptionService } from 'src/common/helper/services/helper.encryption.service';
import { HelperHashService } from 'src/common/helper/services/helper.hash.service';
import {
  IAuthPassword,
  IAuthPayloadOptions,
} from '../interfaces/auth.interface';

@Injectable()
export class AuthService {
  private readonly accessTokenSecretToken: string;
  private readonly accessTokenExpirationTime: string;
  private readonly accessTokenNotBeforeExpirationTime: string;

  private readonly refreshTokenSecretToken: string;
  private readonly refreshTokenExpirationTime: string;
  private readonly refreshTokenExpirationTimeRememberMe: string;
  private readonly refreshTokenNotBeforeExpirationTime: string;

  constructor(
    private helperHashService: HelperHashService,
    private helperDateService: HelperDateService,
    private helperEncryptionService: HelperEncryptionService,
    private configService: ConfigService,
  ) {
    this.accessTokenSecretToken = this.configService.get<string>(
      'auth.jwt.accessToken.secretKey',
    );
    this.accessTokenExpirationTime = this.configService.get<string>(
      'auth.jwt.accessToken.expirationTime',
    );
    this.accessTokenNotBeforeExpirationTime = this.configService.get<string>(
      'auth.jwt.accessToken.notBeforeExpirationTime',
    );

    this.refreshTokenSecretToken = this.configService.get<string>(
      'auth.jwt.refreshToken.secretKey',
    );
    this.refreshTokenExpirationTime = this.configService.get<string>(
      'auth.jwt.refreshToken.expirationTime',
    );
    this.refreshTokenExpirationTimeRememberMe = this.configService.get<string>(
      'auth.jwt.refreshToken.expirationTimeRememberMe',
    );
    this.refreshTokenNotBeforeExpirationTime = this.configService.get<string>(
      'auth.jwt.refreshToken.notBeforeExpirationTime',
    );
  }

  async createPassword(password: string): Promise<IAuthPassword> {
    const saltLength = this.configService.get<number>(
      'auth.password.saltLength',
    );
    const salt = this.helperHashService.randomSalt(saltLength);

    const passwordExpiredInMs = this.configService.get<number>(
      'auth.password.expiredInMs',
    );
    const passwordExpired: Date =
      this.helperDateService.forwardInMilliseconds(passwordExpiredInMs);

    const passwordHash = this.helperHashService.bcrypt(password, salt);

    return {
      passwordHash,
      passwordExpired,
      salt,
    };
  }

  async createPayloadAccessToken(
    data: Record<string, any>,
    rememberMe: boolean,
    options?: IAuthPayloadOptions,
  ): Promise<Record<string, any>> {
    return {
      ...data,
      rememberMe,
      options: options && options.loginDate ? options.loginDate : undefined,
    };
  }

  async createPayloadRefreshToken(
    _id: string,
    rememberMe: boolean,
    options?: IAuthPayloadOptions,
  ): Promise<Record<string, any>> {
    return {
      _id,
      rememberMe,
      loginDate: options && options.loginDate ? options.loginDate : undefined,
    };
  }

  async createAccessToken(payload: Record<string, any>): Promise<string> {
    return this.helperEncryptionService.jwtEncrypt(payload, {
      secretKey: this.accessTokenSecretToken,
      expiredIn: this.accessTokenExpirationTime,
      notBefore: this.accessTokenNotBeforeExpirationTime,
    });
  }

  async createRefreshToken(
    payload: Record<string, any>,
    rememberMe: boolean,
    test?: boolean,
  ): Promise<string> {
    return this.helperEncryptionService.jwtEncrypt(payload, {
      secretKey: this.refreshTokenSecretToken,
      expiredIn: rememberMe
        ? this.refreshTokenExpirationTimeRememberMe
        : this.refreshTokenExpirationTime,
      notBefore: test ? '0' : this.refreshTokenNotBeforeExpirationTime,
    });
  }
}
