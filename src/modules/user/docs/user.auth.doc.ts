import { applyDecorators } from '@nestjs/common';
import { Doc } from 'src/common/doc/decorators/doc.decorator';
import { UserInfoSerialization } from '../serializations/user.info.serialization';
import { UserLoginSerialization } from '../serializations/user.login.serialization';
import { UserProfileSerialization } from '../serializations/user.profile.serialization';

export function UserAuthRefreshDoc(): MethodDecorator {
  return applyDecorators(
    Doc<UserLoginSerialization>('user.refresh', {
      auth: {
        jwtRefreshToken: true,
      },
      response: {
        serialization: UserLoginSerialization,
      },
    }),
  );
}

export function UserAuthProfileDoc(): MethodDecorator {
  return applyDecorators(
    Doc<UserProfileSerialization>('user.info', {
      auth: {
        jwtAccessToken: true,
      },
      response: {
        serialization: UserProfileSerialization,
      },
    }),
  );
}

export function UserAuthInfoDoc(): MethodDecorator {
  return applyDecorators(
    Doc<UserInfoSerialization>('user.info', {
      auth: {
        jwtAccessToken: true,
      },
      response: {
        serialization: UserInfoSerialization,
      },
    }),
  );
}

export function UserAuthChangePasswordDoc(): MethodDecorator {
  return applyDecorators(
    Doc<void>('user.changePassword', {
      auth: {
        jwtAccessToken: true,
      },
    }),
  );
}
