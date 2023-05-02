import { HttpStatus } from '@nestjs/common';
import { ApiParamOptions, ApiQueryOptions } from '@nestjs/swagger';
import { ClassConstructor } from 'class-transformer';
import {
  ENUM_DOC_REQUEST_BODY_TYPE,
  ENUM_DOC_RESPONSE_BODY_TYPE,
} from '../constants/doc.constant';

export interface IDocDefaultOptions {
  httpStatus: HttpStatus;
  messagePath: string;
  statusCode: number;
  serialization?: ClassConstructor<any>;
}

export interface IDocOptions<T> {
  auth?: IDocAuthOptions;
  requestHeader?: IDocRequestHeaderOptions;
  response?: IDocResponseOptions<T>;
  request?: IDocRequestOptions;
}

export interface IDocAuthOptions {
  jwtAccessToken?: boolean;
  jwtRefreshToken?: boolean;
  apiKey?: boolean;
  permissionToken?: boolean;
}

export interface IDocRequestHeaderOptions {
  userAgent?: boolean;
  timestamp?: boolean;
}

export interface IDocRequestOptions {
  params?: ApiParamOptions[];
  queries?: ApiQueryOptions[];
  bodyType?: ENUM_DOC_REQUEST_BODY_TYPE;
  file?: {
    multiple: boolean;
  };
}

export interface IDocResponseOptions<T> {
  statusCode?: number;
  httpStatus?: HttpStatus;
  bodyType?: ENUM_DOC_RESPONSE_BODY_TYPE;
  serialization?: ClassConstructor<T>;
}