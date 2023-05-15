import { Global, Module } from '@nestjs/common';
import { SettingRepositoryModule } from 'src/common/setting/repository/setting.repository.module';
import { SettingService } from './services/setting.service';

@Global()
@Module({
  imports: [SettingRepositoryModule],
  exports: [SettingService],
  providers: [SettingService],
  controllers: [],
})
export class SettingModule {}
