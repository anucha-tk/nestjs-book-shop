import { applyDecorators } from '@nestjs/common';
import { Doc } from 'src/common/doc/decorators/doc.decorator';
import { UserInfoSerialization } from '../serializations/user.info.serialization';
import { UserProfileSerialization } from '../serializations/user.profile.serialization';

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
