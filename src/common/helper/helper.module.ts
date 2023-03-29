import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { HelperDateService } from './services/helper.date.service';
import { HelperEncryptionService } from './services/helper.encryption.service';
import { HelperHashService } from './services/helper.hash.service';

@Global()
@Module({
  providers: [HelperHashService, HelperDateService, HelperEncryptionService],
  exports: [HelperHashService, HelperDateService, HelperEncryptionService],
  imports: [
    JwtModule.registerAsync({
      inject: [ConfigService],
      imports: [ConfigModule],
      useFactory: () => ({}),
    }),
  ],
})
export class HelperModule {}