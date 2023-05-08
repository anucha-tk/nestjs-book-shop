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

export function AppHelloApiKeyDoc(): MethodDecorator {
  return applyDecorators(
    Doc<AppHelloSerialization>('app.helloApiKey', {
      auth: {
        apiKey: true,
      },
      requestHeader: {
        timestamp: true,
        userAgent: true,
      },
      response: {
        serialization: AppHelloSerialization,
      },
    }),
  );
}
