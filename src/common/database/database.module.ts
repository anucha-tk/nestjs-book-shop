import { Module } from '@nestjs/common';
import { DatabaseOptionsService } from './services/database.options.services';

@Module({
  providers: [DatabaseOptionsService],
  exports: [DatabaseOptionsService],
  imports: [],
})
export class DatabaseOptionsModule {}
