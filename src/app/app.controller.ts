import { Controller, Get, VERSION_NEUTRAL } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiExcludeEndpoint, ApiTags } from '@nestjs/swagger';
import { HelperDateService } from 'src/common/helper/services/helper.date.service';
import {
  RequestTimeout,
  RequestUserAgent,
} from 'src/common/request/decorators/request.decorator';
import { Response } from 'src/common/response/decorators/response.decorator';
import { IResponse } from 'src/common/response/interfaces/response.interface';
import { IResult } from 'ua-parser-js';
import { AppHelloDoc } from './docs/app.doc';
import { AppHelloSerialization } from './serializations/app.hello.serialization';

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

  @ApiExcludeEndpoint()
  @RequestTimeout('1s')
  @Get('/timeout')
  async timeout(): Promise<string> {
    await new Promise((resolve) => setTimeout(resolve, 2000)); // Wait for 2000 seconds
    return 'error timeout response';
  }
}
