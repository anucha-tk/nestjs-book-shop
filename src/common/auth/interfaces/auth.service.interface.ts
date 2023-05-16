import {
  IAuthPassword,
  IAuthPayloadOptions,
  IAuthRefreshTokenOptions,
} from './auth.interface';

export interface IAuthService {
  decryptAccessToken(
    payload: Record<string, any>,
  ): Promise<Record<string, any>>;
  encryptAccessToken(payload: Record<string, any>): Promise<string>;
  encryptRefreshToken(payload: Record<string, any>): Promise<string>;
  createSalt(length: number): Promise<string>;
  createPassword(password: string): Promise<IAuthPassword>;
  validateUser(passwordString: string, passwordHash: string): Promise<boolean>;
  getTokenType(): Promise<string>;
  getAccessTokenExpirationTime(): Promise<number>;
  createPayloadAccessToken(
    data: Record<string, any>,
  ): Promise<Record<string, any>>;
  createPayloadRefreshToken(
    _id: string,
    options: IAuthPayloadOptions,
  ): Promise<Record<string, any>>;
  getPayloadEncryption(): Promise<boolean>;
  createAccessToken(
    payloadHashed: string | Record<string, any>,
  ): Promise<string>;
  createRefreshToken(
    payloadHashed: string | Record<string, any>,
    options?: IAuthRefreshTokenOptions,
  ): Promise<string>;
  checkPasswordExpired(passwordExpired: Date): Promise<boolean>;
}
