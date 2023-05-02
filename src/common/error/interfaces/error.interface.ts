import { ValidationError } from 'class-validator';
import {
  IMessage,
  IMessageOptionsProperties,
} from 'src/common/message/interfaces/message.interface';
import { ERROR_TYPE } from '../constants/error.enum.constant';

// error default
export interface IErrors {
  readonly message: string | IMessage;
  readonly property: string;
}

// error import
export interface IErrorsImport {
  row: number;
  file?: string;
  errors: IErrors[];
}

export interface IValidationErrorImport extends Omit<IErrorsImport, 'errors'> {
  errors: ValidationError[];
}

// error exception
export interface IErrorException {
  statusCode: number;
  message: string;
  _error?: string;
  errors?: ValidationError[] | IValidationErrorImport[];
  _errorType?: ERROR_TYPE;
  _metadata?: Record<string, any>;
  data?: Record<string, any>;
  properties?: IMessageOptionsProperties;
}

export interface IErrorHttpFilterMetadata {
  languages: string[];
  timestamp: number;
  timezone: string;
  requestId: string;
  path: string;
  [key: string]: any;
}

export interface IErrorHttpFilter {
  statusCode: number;
  message: string | IMessage;
  _error?: string;
  errors?: IErrors[] | IErrorsImport[];
  _metadata: IErrorHttpFilterMetadata;
  data?: Record<string, any>;
}
