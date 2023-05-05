import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import {
  RequestJsonBodyParserMiddleware,
  RequestRawBodyParserMiddleware,
  RequestTextBodyParserMiddleware,
  RequestUrlencodedBodyParserMiddleware,
} from './body-parser/request.body-parser.middleware';
import { RequestHelmetMiddleware } from './helmet/request.helmet.middleware';
import { RequestIdMiddleware } from './id/request.id.middleware';

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
      )
      .forRoutes('*');
  }
}
