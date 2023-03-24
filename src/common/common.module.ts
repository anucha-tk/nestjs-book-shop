import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import Configs from 'src/configs';
import Joi from 'joi';
import { MongooseModule } from '@nestjs/mongoose';
import { DatabaseOptionsService } from './database/services/database.options.services';
import { DatabaseOptionsModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { HelperModule } from './helper/helper.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: Configs,
      isGlobal: true,
      cache: true,
      envFilePath: ['.env'],
      expandVariables: true,
      validationSchema: Joi.object({
        // app
        APP_PORT: Joi.number().default(5000).required(),
        // database
        DB_HOST: Joi.string().required(),
        DB_NAME: Joi.string().required(),
        DB_USER: Joi.string().required(),
        DB_USER_PWD: Joi.string().required(),
      }),
    }),
    MongooseModule.forRootAsync({
      // connectionName: 'PrimaryConnectionDatabase',
      inject: [DatabaseOptionsService],
      imports: [DatabaseOptionsModule],
      useFactory: (databaseOptionsService: DatabaseOptionsService) =>
        databaseOptionsService.createMongooseOptions(),
    }),
    HelperModule,
    AuthModule,
  ],
})
export class CommonModule {}
