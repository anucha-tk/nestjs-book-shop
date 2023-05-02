import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { HttpArgumentsHost, ValidationError } from '@nestjs/common/interfaces';
import { ConfigService } from '@nestjs/config';
import { HelperDateService } from 'src/common/helper/services/helper.date.service';
import { IRequestApp } from 'src/common/request/interfaces/request.interface';
import { Response } from 'express';
import { DatabaseDefaultUUID } from 'src/common/database/constants/database.function.constant';
import {
  IErrorException,
  IErrorHttpFilter,
  IErrorHttpFilterMetadata,
  IErrors,
  IErrorsImport,
  IValidationErrorImport,
} from '../interfaces/error.interface';
import { ERROR_TYPE } from '../constants/error.enum.constant';
import { MessageService } from 'src/common/message/services/message.service';
import { IMessage } from 'src/common/message/interfaces/message.interface';

@Catch()
export class ErrorHttpFilter implements ExceptionFilter {
  private readonly appDefaultLanguage: string[];
  private readonly version: string;
  private readonly repoVersion: string;

  constructor(
    private readonly helperDateService: HelperDateService,
    private readonly configService: ConfigService,
    private readonly messageService: MessageService,
  ) {
    this.appDefaultLanguage = this.configService.get<string[]>('app.language');
    this.version = this.configService.get<string>('app.versioning.version');
    this.repoVersion = this.configService.get<string>('app.repoVersion');
  }
  async catch(exception: unknown, host: ArgumentsHost): Promise<void> {
    const ctx: HttpArgumentsHost = host.switchToHttp();
    const request = ctx.getRequest<IRequestApp>();

    // get request headers
    const customLang: string[] =
      ctx.getRequest<IRequestApp>().customLang ?? this.appDefaultLanguage;

    // get _metadata
    const __requestId = request.id ?? DatabaseDefaultUUID();
    const __path = request.path;
    const __timestamp = request.timestamp ?? this.helperDateService.timestamp();
    const __timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const __version = request.version ?? this.version;
    const __repoVersion = request.repoVersion ?? this.repoVersion;

    // TODO: try Debugger

    let responseExpress: Response = ctx.getResponse<Response>();
    let statusHttp: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
    if (exception instanceof HttpException) {
      statusHttp = exception.getStatus();

      // Restructure
      const response = exception.getResponse();
      if (this.isErrorException(response)) {
        const responseException = response as IErrorException;
        const { statusCode, message, _errorType, data, properties, _metadata } =
          responseException;

        let { errors, _error } = responseException;
        errors = await this.checkErrorType(errors, _errorType, customLang);

        if (!_error) {
          _error = 'message' in exception ? exception.message : undefined;
        } else if (typeof _error !== 'string') {
          _error = JSON.stringify(_error);
        }

        const mapMessage: string | IMessage = await this.messageService.get(
          message,
          {
            customLanguages: customLang,
            properties,
          },
        );

        const resMetadata = this.getResMetadata({
          customLang,
          __timestamp,
          __timezone,
          __requestId,
          __path,
          __version,
          __repoVersion,
          _metadata,
        });

        const resResponse = this.getResponseBody({
          statusCode,
          statusHttp,
          message: mapMessage,
          _error,
          errors,
          resMetadata,
          data,
        });

        responseExpress = this.getResponseExpress({
          responseExpress: responseExpress,
          customLang,
          __timestamp,
          __timezone,
          __requestId,
          __version,
          __repoVersion,
          statusHttp,
          resResponse,
        });

        return;
      }
    }

    const message: string = await this.messageService.get(`http.${statusHttp}`);
    const resMetadata = this.getResMetadata({
      customLang,
      __timestamp,
      __timezone,
      __requestId,
      __path,
      __version,
      __repoVersion,
    });
    const resResponse = this.getResponseBody({
      statusHttp,
      message,
      _error:
        exception instanceof Error && 'message' in exception
          ? exception.message
          : (exception as string),
      resMetadata,
    });

    /* eslint-disable @typescript-eslint/no-unused-vars */
    responseExpress = this.getResponseExpress({
      responseExpress: responseExpress,
      customLang,
      __timestamp,
      __timezone,
      __requestId,
      __version,
      __repoVersion,
      statusHttp,
      resResponse,
    });

    return;
  }

  getResMetadata({
    customLang,
    __timestamp,
    __timezone,
    __requestId,
    __path,
    __version,
    __repoVersion,
    _metadata,
  }: {
    customLang: string[];
    __timestamp: number;
    __timezone: string;
    __requestId: string;
    __path: string;
    __version: string;
    __repoVersion: string;
    _metadata?: Record<string, any>;
  }): IErrorHttpFilterMetadata {
    return {
      languages: customLang,
      timestamp: __timestamp,
      timezone: __timezone,
      requestId: __requestId,
      path: __path,
      version: __version,
      repoVersion: __repoVersion,
      ..._metadata,
    };
  }

  getResponseBody({
    statusCode,
    statusHttp,
    message,
    _error,
    errors,
    resMetadata,
    data,
  }: {
    statusCode?: number;
    statusHttp: HttpStatus;
    message: string | IMessage;
    _error: string;
    errors?: ValidationError[] | IValidationErrorImport[];
    resMetadata: IErrorHttpFilterMetadata;
    data?: Record<string, any>;
  }): IErrorHttpFilter {
    return {
      statusCode: statusCode ?? statusHttp,
      message,
      _error,
      errors: errors as IErrors[] | IErrorsImport[],
      _metadata: resMetadata,
      data,
    };
  }

  async checkErrorType(
    errors: ValidationError[] | IValidationErrorImport[],
    _errorType: ERROR_TYPE,
    customLang: string[],
  ): Promise<ValidationError[] | IValidationErrorImport[]> {
    if (errors?.length > 0) {
      errors =
        _errorType === ERROR_TYPE.IMPORT
          ? await this.messageService.getImportErrorsMessage(
              errors as IValidationErrorImport[],
              customLang,
            )
          : await this.messageService.getRequestErrorsMessage(
              errors as ValidationError[],
              customLang,
            );
      return errors;
    }
  }

  getResponseExpress({
    responseExpress,
    customLang,
    __timestamp,
    __timezone,
    __requestId,
    __version,
    __repoVersion,
    statusHttp,
    resResponse,
  }: {
    responseExpress: Response;
    customLang: string[];
    __timestamp: number;
    __timezone: string;
    __requestId: string;
    __version: string;
    __repoVersion: string;
    statusHttp: HttpStatus;
    resResponse: IErrorHttpFilter;
  }) {
    return responseExpress
      .setHeader('x-custom-lang', customLang)
      .setHeader('x-timestamp', __timestamp)
      .setHeader('x-timezone', __timezone)
      .setHeader('x-request-id', __requestId)
      .setHeader('x-version', __version)
      .setHeader('x-repo-version', __repoVersion)
      .status(statusHttp)
      .json(resResponse);
  }

  isErrorException(obj: any): obj is IErrorException {
    return typeof obj === 'object'
      ? 'statusCode' in obj && 'message' in obj
      : false;
  }
}
