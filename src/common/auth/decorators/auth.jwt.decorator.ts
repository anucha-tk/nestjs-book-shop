import {
  applyDecorators,
  createParamDecorator,
  ExecutionContext,
  SetMetadata,
  UseGuards,
} from '@nestjs/common';
import { IRequestApp } from 'src/common/request/interfaces/request.interface';
import { ROLE_TYPE_META_KEY } from 'src/modules/role/constants/role.constant';
import { ENUM_ROLE_TYPE } from 'src/modules/role/constants/role.enum.constant';
import { RolePayloadTypeGuard } from 'src/modules/role/guards/payload/role.payload.type.guard';
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

/**
 * @description this decorator have two guards
 * 1. `AuthJwtAccessGuard` jwt accessToken guard and set req.user
 * 2. `RolePayloadTypeGuard` check role required from META_KEY
 * @example
 * how to get req.user - `@AuthJwtPayload()`
 * how to set role required - SetMetadata(ROLE_TYPE_META_KEY, [ENUM_ROLE_TYPE.USER]),
 * */
export function AuthJwtUserAccessProtected(): MethodDecorator {
  return applyDecorators(
    UseGuards(AuthJwtAccessGuard, RolePayloadTypeGuard),
    SetMetadata(ROLE_TYPE_META_KEY, [ENUM_ROLE_TYPE.USER]),
  );
}
