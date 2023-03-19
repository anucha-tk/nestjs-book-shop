import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port: number = configService.get<number>('app.http.port');
  const host: string = configService.get<string>('database.host');
  const databaseName: string = configService.get<string>('database.name');

  //TODO: move ,define validate
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(port);
  const logger = new Logger();

  logger.log(`==========================================================`);

  logger.log(`Server run on port: ${port}`);

  logger.log(`Database running on ${host}/${databaseName}`, 'NestApplication');

  logger.log(`Server running on ${await app.getUrl()}`, 'NestApplication');

  logger.log(`==========================================================`);
}
bootstrap();
