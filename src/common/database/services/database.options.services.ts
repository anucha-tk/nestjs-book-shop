import { Injectable } from '@nestjs/common';
import { MongooseModuleOptions } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { IDatabaseOptionsService } from '../interfaces/database.options-service.interface';
import mongoose from 'mongoose';
import { ENUM_APP_ENVIRONMENT } from 'src/app/constants/app.enum.constant';

@Injectable()
export class DatabaseOptionsService implements IDatabaseOptionsService {
  private readonly host: string;
  private readonly database: string;
  private readonly user: string;
  private readonly password: string;
  private readonly options: string;
  private readonly debug: boolean;
  private readonly env: string;

  constructor(private readonly configService: ConfigService) {
    this.host = this.configService.get<string>('database.host');
    this.database = this.configService.get<string>('database.name');
    this.user = this.configService.get<string>('database.user');
    this.password = this.configService.get<string>('database.password');
    this.options = this.configService.get<string>('database.options')
      ? `?${this.configService.get<string>('database.options')}`
      : '';
    this.debug = this.configService.get<boolean>('database.debug');
  }

  createOptions(): MongooseModuleOptions {
    let uri = `${this.host}`;

    if (this.database) {
      uri = `${uri}/${this.database}${this.options}`;
    }

    if (this.env !== ENUM_APP_ENVIRONMENT.PRODUCTION) {
      mongoose.set('debug', this.debug);
    }

    const mongooseOptions: MongooseModuleOptions = {
      uri,
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      // useMongoClient: true,
    };

    // database auth
    if (this.user && this.password) {
      mongooseOptions.auth = {
        username: this.user,
        password: this.password,
      };
    }

    return mongooseOptions;
  }
}
