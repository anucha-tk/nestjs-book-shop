import { ValidationError } from 'class-validator';
import {
  IErrors,
  IErrorsImport,
  IValidationErrorImport,
} from 'src/common/error/interfaces/error.interface';
import {
  IMessage,
  IMessageOptions,
  IMessageSetOptions,
} from './message.interface';

export interface IMessageService {
  setMessage<T = string>(
    lang: string,
    key: string,
    options?: IMessageSetOptions,
  ): T;

  getRequestErrorsMessage(
    requestErrors: ValidationError[],
    customLanguages?: string[],
  ): Promise<IErrors[]>;

  getImportErrorsMessage(
    errors: IValidationErrorImport[],
    customLanguages?: string[],
  ): Promise<IErrorsImport[]>;

  get(key: string, options?: IMessageOptions): Promise<string | IMessage>;
}
