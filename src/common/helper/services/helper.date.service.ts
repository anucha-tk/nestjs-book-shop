import { Injectable } from '@nestjs/common';
import moment from 'moment';

@Injectable()
export class HelperDateService {
  create(): Date {
    return moment().toDate();
  }

  forwardInMilliseconds(milliseconds: number): Date {
    return moment().add(milliseconds, 'ms').toDate();
  }
}
