import { ENUM_AUTH_LOGIN_WITH } from '../constants/auth.enum.constant';

export interface IAuthPassword {
  salt: string;
  passwordHash: string;
  passwordExpired: Date;
  passwordCreated: Date;
}

export interface IAuthPayloadOptions {
  loginWith: ENUM_AUTH_LOGIN_WITH;
}

export interface IAuthRefreshTokenOptions {
  notBeforeExpirationTime?: number | string;
}

export interface IAuthGooglePayload {
  email: string;
  firstName: string;
  lastName: string;
  accessToken: string;
  refreshToken: string;
}
