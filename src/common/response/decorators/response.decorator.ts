import { applyDecorators, SetMetadata, UseInterceptors } from '@nestjs/common';
import {
  RESPONSE_MESSAGE_PATH_META_KEY,
  RESPONSE_MESSAGE_PROPERTIES_META_KEY,
  RESPONSE_SERIALIZATION_META_KEY,
} from '../constants/response.constant';
import { ResponseDefaultInterceptor } from '../interceptors/response.default.interceptor';
import { IResponseOptions } from '../interfaces/response.interface';

export function Response<T>(
  messagePath: string,
  options?: IResponseOptions<T>,
): MethodDecorator {
  return applyDecorators(
    UseInterceptors(ResponseDefaultInterceptor<T>),
    SetMetadata(RESPONSE_MESSAGE_PATH_META_KEY, messagePath),
    SetMetadata(
      RESPONSE_SERIALIZATION_META_KEY,
      options ? options.serialization : undefined,
    ),
    SetMetadata(
      RESPONSE_MESSAGE_PROPERTIES_META_KEY,
      options ? options.messageProperties : undefined,
    ),
  );
}
