import { Controller, Get, VERSION_NEUTRAL } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiExcludeEndpoint, ApiTags } from '@nestjs/swagger';
import { ApiKeyPublicProtected } from 'src/common/api-key/decorators/api-key.decorator';
import { HelperDateService } from 'src/common/helper/services/helper.date.service';
import { ENUM_LOGGER_ACTION } from 'src/common/logger/constants/logger.enum.constant';
import { Logger } from 'src/common/logger/decorators/logger.decorator';
import {
  RequestTimeout,
  RequestUserAgent,
} from 'src/common/request/decorators/request.decorator';
import { Response } from 'src/common/response/decorators/response.decorator';
import { IResponse } from 'src/common/response/interfaces/response.interface';
import { IResult } from 'ua-parser-js';
import { AppHelloApiKeyDoc, AppHelloDoc } from '../docs/app.doc';
import { AppHelloSerialization } from '../serializations/app.hello.serialization';

@ApiTags('hello')
@Controller({
  version: VERSION_NEUTRAL,
  path: '',
})
export class AppController {
  private readonly serviceName: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly helperDateService: HelperDateService,
  ) {
    this.serviceName = this.configService.get<string>('app.name');
  }

  @AppHelloDoc()
  @Response('app.hello', { serialization: AppHelloSerialization })
  @Logger(ENUM_LOGGER_ACTION.TEST, { tags: ['test'] })
  @Get('/hello')
  async hello(@RequestUserAgent() userAgent: IResult): Promise<IResponse> {
    const newDate = this.helperDateService.create();
    return {
      _metadata: {
        customProperty: {
          messageProperties: {
            serviceName: this.serviceName,
          },
        },
      },
      data: {
        userAgent,
        date: newDate,
        format: this.helperDateService.format(newDate),
        timestamp: this.helperDateService.timestamp(newDate),
      },
    };
  }

  @AppHelloApiKeyDoc()
  @Response('app.hello', { serialization: AppHelloSerialization })
  @ApiKeyPublicProtected()
  @Logger(ENUM_LOGGER_ACTION.TEST, { tags: ['test'] })
  @Get('/hello/api-key')
  async helloApiKey(
    @RequestUserAgent() userAgent: IResult,
  ): Promise<IResponse> {
    const newDate = this.helperDateService.create();

    return {
      _metadata: {
        customProperty: {
          messageProperties: {
            serviceName: this.serviceName,
          },
        },
      },
      data: {
        userAgent,
        date: newDate,
        format: this.helperDateService.format(newDate),
        timestamp: this.helperDateService.timestamp(newDate),
      },
    };
  }

  @ApiExcludeEndpoint()
  @RequestTimeout('1s')
  @Logger(ENUM_LOGGER_ACTION.TEST, { tags: ['test'] })
  @Get('/timeout')
  async timeout(): Promise<string> {
    await new Promise((resolve) => setTimeout(resolve, 2000)); // Wait for 2000 seconds
    return 'error timeout response';
  }
}
