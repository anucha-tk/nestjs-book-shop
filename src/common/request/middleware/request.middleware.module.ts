import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { RequestHelmetMiddleware } from './helmet/request.helmet.middleware';

@Module({})
export class RequestMiddlewareModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(RequestHelmetMiddleware).forRoutes('*');
  }
}
