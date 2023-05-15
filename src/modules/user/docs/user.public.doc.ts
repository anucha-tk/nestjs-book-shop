import { applyDecorators, HttpStatus } from '@nestjs/common';
import { Doc } from 'src/common/doc/decorators/doc.decorator';
import { UserLoginSerialization } from '../serializations/user.login.serialization';

export function UserPublicLoginDoc(): MethodDecorator {
  return applyDecorators(
    Doc('user.login', {
      auth: {
        jwtAccessToken: true,
      },
      response: {
        serialization: UserLoginSerialization,
      },
    }),
  );
}

export function UserPublicSignUpDoc(): MethodDecorator {
  return applyDecorators(
    Doc('user.signUp', {
      auth: {
        jwtAccessToken: false,
      },
      response: {
        httpStatus: HttpStatus.CREATED,
      },
    }),
  );
}
