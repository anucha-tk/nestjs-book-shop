import { applyDecorators } from '@nestjs/common';
import { Doc } from 'src/common/doc/decorators/doc.decorator';
import { AppHelloSerialization } from '../serializations/app.hello.serialization';

export function AppHelloDoc(): MethodDecorator {
  return applyDecorators(
    Doc<AppHelloSerialization>('app.hello', {
      response: { serialization: AppHelloSerialization },
    }),
  );
}
