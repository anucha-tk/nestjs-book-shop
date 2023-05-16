import { DynamicModule, Module, Provider } from '@nestjs/common';
import { AuthJwtAccessStrategy } from './guards/jwt-access/auth.jwt-access.strategy';
import { AuthService } from './services/auth.service';

@Module({
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {
  static forRoot(): DynamicModule {
    const providers: Provider<any>[] = [AuthJwtAccessStrategy];
    return {
      module: AuthModule,
      providers,
      exports: [],
      controllers: [],
      imports: [],
    };
  }
}
