import { DynamicModule, Module, Provider } from '@nestjs/common';
import { AuthGoogleOAuth2LoginStrategy } from './guards/google-oauth2/auth.google-oauth2.login.strategy';
import { AuthGoogleOAuth2SignUpStrategy } from './guards/google-oauth2/auth.google-oauth2.sign-up.strategy';
import { AuthJwtAccessStrategy } from './guards/jwt-access/auth.jwt-access.strategy';
import { AuthJwtRefreshStrategy } from './guards/jwt-refresh/auth.jwt-refresh.strategy';
import { AuthService } from './services/auth.service';

@Module({
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {
  static forRoot(): DynamicModule {
    const providers: Provider<any>[] = [
      AuthJwtAccessStrategy,
      AuthJwtRefreshStrategy,
    ];
    if (
      process.env.SSO_GOOGLE_CLIENT_ID &&
      process.env.SSO_GOOGLE_CLIENT_SECRET
    ) {
      providers.push(AuthGoogleOAuth2LoginStrategy);
      providers.push(AuthGoogleOAuth2SignUpStrategy);
    }
    return {
      module: AuthModule,
      providers,
      exports: [],
      controllers: [],
      imports: [],
    };
  }
}
