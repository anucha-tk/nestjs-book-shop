import { applyDecorators, HttpStatus } from '@nestjs/common';
import {
  ApiBody,
  ApiConsumes,
  ApiExtraModels,
  ApiHeader,
  ApiProduces,
  ApiResponse,
  getSchemaPath,
} from '@nestjs/swagger';
import { APP_LANGUAGE } from 'src/app/constants/app.constant';
import { ENUM_ERROR_STATUS_CODE_ERROR } from 'src/common/error/constants/error.status-code.constant';
import { ENUM_FILE_EXCEL_MIME } from 'src/common/file/constants/file.enum.constant';
import { FileMultipleDto } from 'src/common/file/dtos/file.multiple.dto';
import { FileSingleDto } from 'src/common/file/dtos/file.single.dto';
import { ResponseDefaultSerialization } from 'src/common/response/serializations/response.default.serialization';
import {
  ENUM_DOC_REQUEST_BODY_TYPE,
  ENUM_DOC_RESPONSE_BODY_TYPE,
} from '../constants/doc.constant';
import { IDocDefaultOptions, IDocOptions } from '../interfaces/doc.interface';

function getRequestBodyDocs<T>(options?: IDocOptions<T>) {
  const requestBodyDocs = [];

  switch (options?.request?.bodyType) {
    case ENUM_DOC_REQUEST_BODY_TYPE.FORM_DATA:
      requestBodyDocs.push(ApiConsumes('multipart/form-data'));

      if (options?.request?.file?.multiple) {
        requestBodyDocs.push(
          ApiBody({
            description: 'Multiple file',
            type: FileMultipleDto,
          }),
        );
      } else {
        requestBodyDocs.push(
          ApiBody({
            description: 'Single file',
            type: FileSingleDto,
          }),
        );
      }
      break;
    case ENUM_DOC_REQUEST_BODY_TYPE.TEXT:
      requestBodyDocs.push(ApiConsumes('text/plain'));
      break;
    default:
      requestBodyDocs.push(ApiConsumes('application/json'));
      break;
  }

  return requestBodyDocs;
}

function getResponseDocs<T>(
  normDoc: IDocDefaultOptions,
  options: IDocOptions<T>,
) {
  const responseDocs = [];
  switch (options?.response?.bodyType) {
    case ENUM_DOC_RESPONSE_BODY_TYPE.FILE:
      responseDocs.push(ApiProduces(ENUM_FILE_EXCEL_MIME.XLSX));
      break;
    case ENUM_DOC_RESPONSE_BODY_TYPE.TEXT:
      responseDocs.push(ApiProduces('text/plain'));
      break;
    default:
      responseDocs.push(ApiProduces('application/json'));
      if (options?.response?.serialization) {
        normDoc.serialization = options?.response?.serialization;
      }
      break;
  }
  return responseDocs;
}

export function Doc<T>(
  messagePath: string,
  options?: IDocOptions<T>,
): MethodDecorator {
  const docs = [];
  const normDoc: IDocDefaultOptions = {
    httpStatus: options?.response?.httpStatus ?? HttpStatus.OK,
    messagePath,
    statusCode: options?.response?.statusCode,
  };

  if (!normDoc.statusCode) {
    normDoc.statusCode = normDoc.httpStatus;
  }

  docs.push(...getRequestBodyDocs(options));
  docs.push(...getResponseDocs(normDoc, options));
  docs.push(DocDefault(normDoc));
  //TODO: requestHeader
  //TODO: Auths

  return applyDecorators(
    ApiHeader({
      name: 'x-custom-lang',
      description: 'Custom language header',
      required: false,
      schema: {
        default: APP_LANGUAGE,
        example: APP_LANGUAGE,
        type: 'string',
      },
    }),
    DocDefault({
      httpStatus: HttpStatus.SERVICE_UNAVAILABLE,
      messagePath: 'http.serverError.serviceUnavailable',
      statusCode: ENUM_ERROR_STATUS_CODE_ERROR.ERROR_SERVICE_UNAVAILABLE,
    }),
    DocDefault({
      httpStatus: HttpStatus.INTERNAL_SERVER_ERROR,
      messagePath: 'http.serverError.internalServerError',
      statusCode: ENUM_ERROR_STATUS_CODE_ERROR.ERROR_UNKNOWN,
    }),
    DocDefault({
      httpStatus: HttpStatus.REQUEST_TIMEOUT,
      messagePath: 'http.serverError.requestTimeout',
      statusCode: ENUM_ERROR_STATUS_CODE_ERROR.ERROR_REQUEST_TIMEOUT,
    }),
    ...docs,
  );
}

export function DocDefault<T>(options: IDocDefaultOptions): MethodDecorator {
  const docs = [];
  const schema: Record<string, any> = {
    allOf: [{ $ref: getSchemaPath(ResponseDefaultSerialization<T>) }],
    properties: {
      message: {
        example: options.messagePath,
      },
      statusCode: {
        type: 'number',
        example: options.statusCode,
      },
    },
  };

  if (options.serialization) {
    docs.push(ApiExtraModels(options.serialization));
    schema.properties = {
      ...schema.properties,
      data: {
        $ref: getSchemaPath(options.serialization),
      },
    };
  }

  return applyDecorators(
    ApiExtraModels(ResponseDefaultSerialization<T>),
    ApiResponse({
      status: options.httpStatus,
      schema,
    }),
    ...docs,
  );
}
