import {
  applyDecorators,
  createParamDecorator,
  ExecutionContext,
  SetMetadata,
  UseGuards,
} from '@nestjs/common';
import { IRequestApp } from 'src/common/request/interfaces/request.interface';
import {
  USER_ACTIVE_META_KEY,
  USER_BLOCKED_META_KEY,
  USER_INACTIVE_PERMANENT_META_KEY,
} from '../constants/user.constant';
import { UserPayloadPutToRequestGuard } from '../guards/payload/user.payload.put-to-request.guard';
import { UserActiveGuard } from '../guards/user.active.guard';
import { UserBlockedGuard } from '../guards/user.block.guard';
import { UserInactivePermanentGuard } from '../guards/user.inactive-permanent';
import { UserNotFoundGuard } from '../guards/user.not-found.guard';
import { UserDoc, UserEntity } from '../repository/entities/user.entity';

/**
 * @description get req.__user
 * @returns UserDoc | UserEntity
 * @example req.__user
 * */
export const GetUser = createParamDecorator(
  (returnPlain: boolean, ctx: ExecutionContext): UserDoc | UserEntity => {
    const { __user } = ctx
      .switchToHttp()
      .getRequest<IRequestApp & { __user: UserDoc }>();

    return returnPlain ? __user.toObject() : __user;
  },
);

/**
 * @description decorator check user exist and return req.__user with populate roles
 * @example can use with `@GetUser()` for get req.__user
 * */
export function UserProtected(): MethodDecorator {
  return applyDecorators(
    UseGuards(UserPayloadPutToRequestGuard, UserNotFoundGuard),
  );
}

export function UserAuthProtected(): MethodDecorator {
  return applyDecorators(
    UseGuards(UserBlockedGuard, UserInactivePermanentGuard, UserActiveGuard),
    SetMetadata(USER_INACTIVE_PERMANENT_META_KEY, [false]),
    SetMetadata(USER_BLOCKED_META_KEY, [false]),
    SetMetadata(USER_ACTIVE_META_KEY, [true]),
  );
}
