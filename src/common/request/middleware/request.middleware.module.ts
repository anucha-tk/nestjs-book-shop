import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import {
  RequestJsonBodyParserMiddleware,
  RequestRawBodyParserMiddleware,
  RequestTextBodyParserMiddleware,
  RequestUrlencodedBodyParserMiddleware,
} from './body-parser/request.body-parser.middleware';
import { RequestCorsMiddleware } from './cors/request.cors.middleware';
import { RequestHelmetMiddleware } from './helmet/request.helmet.middleware';
import { RequestIdMiddleware } from './id/request.id.middleware';
import { RequestTimestampMiddleware } from './timestamp/request.timestamp.middleware';
import { RequestTimezoneMiddleware } from './timezone/request.timezone.middleware';
import { RequestUserAgentMiddleware } from './user-gent/request.user-agent.middleware';
import { RequestVersionMiddleware } from './version/request.middleware.version';

@Module({})
export class RequestMiddlewareModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply(
        RequestHelmetMiddleware,
        RequestIdMiddleware,
        RequestJsonBodyParserMiddleware,
        RequestRawBodyParserMiddleware,
        RequestTextBodyParserMiddleware,
        RequestUrlencodedBodyParserMiddleware,
        RequestCorsMiddleware,
        RequestTimestampMiddleware,
        RequestTimezoneMiddleware,
        RequestVersionMiddleware,
        RequestUserAgentMiddleware,
      )
      .forRoutes('*');
  }
}
