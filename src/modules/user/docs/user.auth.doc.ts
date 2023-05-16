import { applyDecorators } from '@nestjs/common';
import { Doc } from 'src/common/doc/decorators/doc.decorator';
import { UserInfoSerialization } from '../serializations/user.info.serialization';

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
