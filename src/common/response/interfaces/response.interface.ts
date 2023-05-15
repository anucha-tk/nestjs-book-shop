import { ClassConstructor } from 'class-transformer';
import { IMessageOptionsProperties } from 'src/common/message/interfaces/message.interface';

export interface IResponseMetadata {
  statusCode?: number;
  message?: string;
  messageProperties?: IMessageOptionsProperties;
  [key: string]: any;
}

export interface IResponseOptions<T> {
  serialization?: ClassConstructor<T>;
  messageProperties?: IMessageOptionsProperties;
}

export interface IResponse {
  _metadata?: IResponseMetadata;
  data?: Record<string, any>;
}
