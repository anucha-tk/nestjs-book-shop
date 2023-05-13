import { Module } from '@nestjs/common';
import { AuthModule } from 'src/common/auth/auth.module';
import { RoleModule } from 'src/modules/role/role.module';
import { UserPublicController } from 'src/modules/user/controllers/user.public.controller';
import { UserModule } from 'src/modules/user/user.module';

@Module({
  controllers: [UserPublicController],
  providers: [],
  imports: [UserModule, AuthModule, RoleModule],
  exports: [],
})
export class RoutesPublicModule {}
