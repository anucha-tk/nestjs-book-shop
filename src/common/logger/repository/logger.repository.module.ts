import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DATABASE_CONNECTION_NAME } from 'src/common/database/constants/database.constant';
import { LoggerEntity, LoggerSchema } from './entities/logger.entity';
import { LoggerRepository } from './repositories/logger.repository';

@Module({
  providers: [LoggerRepository],
  exports: [LoggerRepository],
  controllers: [],
  imports: [
    MongooseModule.forFeature(
      [
        {
          name: LoggerEntity.name,
          schema: LoggerSchema,
        },
      ],
      DATABASE_CONNECTION_NAME,
    ),
  ],
})
export class LoggerRepositoryModule {}
