import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import Configs from 'src/configs';
import Joi from 'joi';
import { MongooseModule } from '@nestjs/mongoose';
import { DatabaseOptionsService } from './database/services/database.options.services';
import { AuthModule } from './auth/auth.module';
import { HelperModule } from './helper/helper.module';
import { ENUM_MESSAGE_LANGUAGE } from './message/constants/message.enum.constants';
import { APP_LANGUAGE } from 'src/app/constants/app.constant';
import { MessageModule } from './message/message.module';
import { ResponseModule } from './response/response.module';
import { ENUM_APP_ENVIRONMENT } from 'src/app/constants/app.enum.constant';
import { RequestModule } from './request/request.module';
import { DatabaseOptionsModule } from './database/database.options.module';
import { DATABASE_CONNECTION_NAME } from './database/constants/database.constant';
import { ErrorModule } from './error/error.module';

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
        APP_NAME: Joi.string().required(),
        APP_ENV: Joi.string()
          .valid(...Object.values(ENUM_APP_ENVIRONMENT))
          .default('development')
          .required(),
        APP_LANGUAGE: Joi.string()
          .valid(...Object.values(ENUM_MESSAGE_LANGUAGE))
          .default(APP_LANGUAGE)
          .required(),
        //HTTP
        HTTP_ENABLE: Joi.boolean().default(true).required(),
        HTTP_HOST: [
          Joi.string().ip({ version: 'ipv4' }).required(),
          Joi.valid('localhost').required(),
        ],
        HTTP_PORT: Joi.number().default(3000).required(),
        HTTP_VERSIONING_ENABLE: Joi.boolean().default(true).required(),
        HTTP_VERSION: Joi.number().required(),
        // database
        DATABASE_HOST: Joi.string()
          .default('mongodb://localhost:27017')
          .required(),
        DATABASE_NAME: Joi.string().required(),
        DATABASE_USER: Joi.string().required(),
        DATABASE_USER_PWD: Joi.string().required(),
        DATABASE_DEBUG: Joi.boolean().default(false).required(),
        DATABASE_OPTIONS: Joi.string().allow(null, '').optional(),
        // JWT
        AUTH_JWT_ACCESS_TOKEN_SECRET_KEY: Joi.string()
          .alphanum()
          .min(5)
          .max(50)
          .required(),
        AUTH_JWT_ACCESS_TOKEN_EXPIRED: Joi.string().default('30m').required(),
        AUTH_JWT_REFRESH_TOKEN_SECRET_KEY: Joi.string()
          .alphanum()
          .min(5)
          .max(50)
          .required(),
        AUTH_JWT_REFRESH_TOKEN_EXPIRED: Joi.string().default('7d').required(),
        AUTH_JWT_REFRESH_TOKEN_REMEMBER_ME_EXPIRED: Joi.string()
          .default('30d')
          .required(),
      }),
    }),
    MongooseModule.forRootAsync({
      connectionName: DATABASE_CONNECTION_NAME,
      inject: [DatabaseOptionsService],
      imports: [DatabaseOptionsModule],
      useFactory: (databaseOptionsService: DatabaseOptionsService) =>
        databaseOptionsService.createOptions(),
    }),
    ErrorModule,
    RequestModule,
    MessageModule,
    ResponseModule,
    HelperModule,
    AuthModule,
  ],
})
export class CommonModule {}
