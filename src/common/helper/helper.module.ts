import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { HelperArrayService } from './services/helper.array.service';
import { HelperDateService } from './services/helper.date.service';
import { HelperEncryptionService } from './services/helper.encryption.service';
import { HelperHashService } from './services/helper.hash.service';
import { HelperNumberService } from './services/helper.number.service';
import { HelperStringService } from './services/helper.string.service';

@Global()
@Module({
  providers: [
    HelperHashService,
    HelperDateService,
    HelperEncryptionService,
    HelperStringService,
    HelperNumberService,
    HelperArrayService,
  ],
  exports: [
    HelperHashService,
    HelperDateService,
    HelperEncryptionService,
    HelperStringService,
    HelperNumberService,
    HelperArrayService,
  ],
  imports: [
    JwtModule.registerAsync({
      inject: [ConfigService],
      imports: [ConfigModule],
      useFactory: () => ({}),
    }),
  ],
})
export class HelperModule {}
