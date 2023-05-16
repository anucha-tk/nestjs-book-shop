import {
  applyDecorators,
  createParamDecorator,
  ExecutionContext,
  UseGuards,
} from '@nestjs/common';
import { IRequestApp } from 'src/common/request/interfaces/request.interface';
import { UserPayloadSerialization } from 'src/modules/user/serializations/user.payload.serialization';
import { AuthJwtAccessGuard } from '../guards/jwt-access/auth.jwt-access.guard';

/**
 * @description get req.user
 * */
export const AuthJwtPayload = createParamDecorator(
  (data: string, ctx: ExecutionContext): Record<string, any> => {
    const { user } = ctx
      .switchToHttp()
      .getRequest<IRequestApp & { user: UserPayloadSerialization }>();
    return data ? user[data] : user;
  },
);

/**
 * @description decorator jwt accessToken guard and have req.user
 * @example use with `@AuthJwtPayload()` for get req.user
 * */
export function AuthJwtAccessProtected(): MethodDecorator {
  return applyDecorators(UseGuards(AuthJwtAccessGuard));
}
