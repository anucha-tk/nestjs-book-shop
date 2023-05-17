import { RouterModule as NestjsRouterModule } from '@nestjs/core';
import { DynamicModule, ForwardReference, Module, Type } from '@nestjs/common';
import { RoutesPublicModule } from './routes/routes.public.module';
import { RoutesModule } from './routes/routes.module';
import { RoutesAuthModule } from './routes/routes.auth.module';
import { AppController } from 'src/app/controllers/app.controller';
import { RoutesUserModule } from './routes/routes.user.module';

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
        RoutesAuthModule,
        RoutesUserModule,
        NestjsRouterModule.register([
          {
            path: '/public',
            module: RoutesPublicModule,
          },
          {
            path: '/auth',
            module: RoutesAuthModule,
          },
          {
            path: '/user',
            module: RoutesUserModule,
          },
        ]),
      );
    }

    return {
      module: RouterModule,
      providers: [],
      exports: [],
      controllers: [AppController],
      imports,
    };
  }
}
