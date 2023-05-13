import { Injectable } from '@nestjs/common';
import moment from 'moment';
import { ENUM_HELPER_DATE_FORMAT } from '../constants/helper.enum.constant';
import {
  IHelperDateOptionsCreate,
  IHelperDateOptionsFormat,
  IHelperDateOptionsForward,
} from '../interfaces/helper.interface';

@Injectable()
export class HelperDateService {
  create(
    date?: string | number | Date,
    options?: IHelperDateOptionsCreate,
  ): Date {
    const mDate = moment(date ?? undefined);

    if (options?.startOfDay) {
      mDate.startOf('day');
    }

    return mDate.toDate();
  }

  forwardInMilliseconds(milliseconds: number): Date {
    return moment().add(milliseconds, 'ms').toDate();
  }

  /**
   * return date format
   * @default ENUM_HELPER_DATE_FORMAT.DATE = YYYY-MM-DD
   * @returns string "xxxx-xx-xx"
   * */
  format(date: Date, options?: IHelperDateOptionsFormat): string {
    return moment(date).format(options?.format ?? ENUM_HELPER_DATE_FORMAT.DATE);
  }

  /**
   * @param date? - string or number or date
   * @param options?.startOfDay - return startOf day
   * @return number of timestamp, example "1680755129622"
   * */
  timestamp(
    date?: string | number | Date,
    options?: IHelperDateOptionsCreate,
  ): number {
    const mDate = moment(date ?? undefined);

    if (options?.startOfDay) mDate.startOf('day');
    return mDate.valueOf();
  }

  startOfDay(date?: Date): Date {
    return moment(date).startOf('day').toDate();
  }

  endOfDay(date?: Date): Date {
    return moment(date).endOf('day').toDate();
  }

  forwardInSeconds(seconds: number, options?: IHelperDateOptionsForward): Date {
    return moment(options?.fromDate).add(seconds, 's').toDate();
  }
}
