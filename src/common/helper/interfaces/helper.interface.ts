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

// Helper Encryption
export interface IHelperJwtVerifyOptions {
  audience: string;
  issuer: string;
  subject: string;
  secretKey: string;
}

export interface IHelperJwtOptions extends IHelperJwtVerifyOptions {
  expiredIn: number | string;
  notBefore?: number | string;
}

export interface IHelperDateOptionsForward {
  fromDate?: Date;
}

// Helper String
export interface IHelperStringRandomOptions {
  upperCase?: boolean;
  safe?: boolean;
  prefix?: string;
}
