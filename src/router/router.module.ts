import { RouterModule as NestjsRouterModule } from '@nestjs/core';
import { DynamicModule, Module } from '@nestjs/common';
import { RoutesPublicModule } from './routes/routes.public.module';

@Module({})
export class RouterModule {
  static register(): DynamicModule {
    return {
      module: RouterModule,
      controllers: [],
      providers: [],
      exports: [],
      imports: [
        RoutesPublicModule,
        NestjsRouterModule.register([
          { path: '/public', module: RoutesPublicModule },
        ]),
      ],
    };
  }
}
