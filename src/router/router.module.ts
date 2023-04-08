import { RouterModule as NestjsRouterModule } from '@nestjs/core';
import { DynamicModule, ForwardReference, Module, Type } from '@nestjs/common';
import { RoutesPublicModule } from './routes/routes.public.module';
import { RoutesModule } from './routes/routes.module';

@Module({})
export class RouterModule {
  static forRoot(): DynamicModule {
    const imports: (
      | DynamicModule
      | Type<any>
      | Promise<DynamicModule>
      | ForwardReference<any>
    )[] = [];

    if (process.env.HTTP_ENABLE === 'true') {
      imports.push(
        RoutesModule,
        RoutesPublicModule,
        NestjsRouterModule.register([
          {
            path: '/',
            module: RoutesModule,
          },
          {
            path: '/public',
            module: RoutesPublicModule,
          },
        ]),
      );
    }

    return {
      module: RouterModule,
      providers: [],
      exports: [],
      controllers: [],
      imports,
    };
  }
}
