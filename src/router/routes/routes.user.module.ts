import { Module } from '@nestjs/common';
import { UserUserController } from 'src/modules/user/controllers/user.user.controller';
import { UserModule } from 'src/modules/user/user.module';

@Module({
  controllers: [UserUserController],
  providers: [],
  imports: [UserModule],
  exports: [],
})
export class RoutesUserModule {}
