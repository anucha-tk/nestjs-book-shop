import { Global, Module } from '@nestjs/common';
import { HelperDateService } from './services/helper.date.service';
import { HelperHashService } from './services/helper.hash.service';

@Global()
@Module({
  providers: [HelperHashService, HelperDateService],
  exports: [HelperHashService, HelperDateService],
})
export class HelperModule {}
