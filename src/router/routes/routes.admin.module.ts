import { Module } from '@nestjs/common';
import { ApiKeyModule } from 'src/common/api-key/api-key.module';
import { AuthModule } from 'src/common/auth/auth.module';
import { RoleModule } from 'src/modules/role/role.module';
import { UserAdminController } from 'src/modules/user/controllers/user.admin.controller';
import { UserModule } from 'src/modules/user/user.module';

@Module({
  controllers: [UserAdminController],
  providers: [],
  exports: [],
  imports: [ApiKeyModule, RoleModule, UserModule, AuthModule],
})
export class RoutesAdminModule {}
