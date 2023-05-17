import { applyDecorators } from '@nestjs/common';
import { DocPaging } from 'src/common/doc/decorators/doc.decorator';
import { UserListSerialization } from '../serializations/user.list.serialization';
import { UserDocQueryBlocked, UserDocQueryIsActive } from './user.doc.constant';

export function UserAdminListDoc(): MethodDecorator {
  return applyDecorators(
    DocPaging<UserListSerialization>('user.list', {
      auth: {
        jwtAccessToken: true,
      },
      request: {
        queries: [...UserDocQueryIsActive, ...UserDocQueryBlocked],
      },
      response: {
        serialization: UserListSerialization,
      },
    }),
  );
}
