import { Controller, Get, VERSION_NEUTRAL } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HelperDateService } from 'src/common/helper/services/helper.date.service';
import { Response } from 'src/common/response/decorators/response.decorator';
import { IResponse } from 'src/common/response/interfaces/response.interface';
import { AppHelloSerialization } from './serializations/app.hello.serialization';

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

  @Response('app.hello', { serialization: AppHelloSerialization })
  @Get('/hello')
  async hello(): Promise<IResponse> {
    const newDate = this.helperDateService.create();
    return {
      _metadata: {
        properties: {
          serviceName: this.serviceName,
        },
      },
      date: newDate,
      format: this.helperDateService.format(newDate),
      timestamp: this.helperDateService.timestamp(newDate),
    };
  }
}
