import { Injectable } from '@nestjs/common';
import {
  MongooseOptionsFactory,
  MongooseModuleOptions,
} from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DatabaseOptionsService implements MongooseOptionsFactory {
  private readonly host: string;
  private readonly database: string;
  private readonly user: string;
  private readonly password: string;

  constructor(private readonly configService: ConfigService) {
    this.host = this.configService.get<string>('database.host');
    this.database = this.configService.get<string>('database.name');
    this.user = this.configService.get<string>('database.user');
    this.password = this.configService.get<string>('database.password');
  }

  createMongooseOptions(): MongooseModuleOptions {
    const uri = `mongodb://${this.host}:27017/${this.database}`;

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
