import { ENUM_HELPER_DATE_FORMAT } from '../constants/helper.enum.constant';

/**
 * @example you can use format = DATE or string = 'YYYY-MM-DD',
 * */
export interface IHelperDateOptionsFormat {
  format?: ENUM_HELPER_DATE_FORMAT | string;
}

export interface IHelperDateOptionsCreate {
  startOfDay?: boolean;
}
