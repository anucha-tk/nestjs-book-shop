import { INestApplication, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ENUM_APP_ENVIRONMENT } from './app/constants/app.enum.constant';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ResponseDefaultSerialization } from './common/response/serializations/response.default.serialization';

export default async function (app: INestApplication) {
  const configService = app.get(ConfigService);
  const env: string = configService.get<string>('app.env');
  const logger = new Logger();

  const docName: string = configService.get<string>('doc.name');
  const docDesc: string = configService.get<string>('doc.description');
  const docVersion: string = configService.get<string>('doc.version');
  const docPrefix: string = configService.get<string>('doc.prefix');

  if (env !== ENUM_APP_ENVIRONMENT.PRODUCTION) {
    const documentBuild = new DocumentBuilder()
      .setTitle(docName)
      .setDescription(docDesc)
      .setVersion(docVersion)
      .addTag("API's")
      .addServer(`/`)
      .addServer(`/staging`)
      .addServer(`/production`)
      .addBearerAuth(
        { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
        'accessToken',
      )
      .addBearerAuth(
        { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
        'refreshToken',
      )
      .addApiKey({ type: 'apiKey', in: 'header', name: 'x-api-key' }, 'apiKey')
      .addApiKey(
        {
          type: 'apiKey',
          in: 'header',
          name: 'x-permission-token',
          description: 'grant permission for /admin prefix endpoints',
        },
        'permissionToken',
      )
      .build();

    const document = SwaggerModule.createDocument(app, documentBuild, {
      deepScanRoutes: true,
      extraModels: [ResponseDefaultSerialization],
    });

    SwaggerModule.setup(docPrefix, app, document, {
      explorer: true,
      customSiteTitle: docName,
    });

    logger.log(`==========================================================`);

    logger.log(`Docs will serve on ${docPrefix}`, 'NestApplication');

    logger.log(`==========================================================`);
  }
}
