import { applyDecorators, HttpStatus } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiExtraModels,
  ApiHeader,
  ApiHeaders,
  ApiParam,
  ApiProduces,
  ApiQuery,
  ApiResponse,
  ApiSecurity,
  getSchemaPath,
} from '@nestjs/swagger';
import { APP_LANGUAGE } from 'src/app/constants/app.constant';
import { ENUM_API_KEY_STATUS_CODE_ERROR } from 'src/common/api-key/constants/api-key.status-code.constant';
import { ENUM_AUTH_STATUS_CODE_ERROR } from 'src/common/auth/constants/auth.status-code.constant';
import { ENUM_ERROR_STATUS_CODE_ERROR } from 'src/common/error/constants/error.status-code.constant';
import { ENUM_FILE_EXCEL_MIME } from 'src/common/file/constants/file.enum.constant';
import { FileMultipleDto } from 'src/common/file/dtos/file.multiple.dto';
import { FileSingleDto } from 'src/common/file/dtos/file.single.dto';
import { ENUM_PAGINATION_ORDER_DIRECTION_TYPE } from 'src/common/pagination/constants/pagination.enum.constant';
import { ENUM_REQUEST_STATUS_CODE_ERROR } from 'src/common/request/constants/request.status-code.constant';
import { Skip } from 'src/common/request/validations/request.skip.validation';
import { ResponseDefaultSerialization } from 'src/common/response/serializations/response.default.serialization';
import { ResponsePagingSerialization } from 'src/common/response/serializations/response.paging.serialization';
import { ENUM_ROLE_STATUS_CODE_ERROR } from 'src/modules/role/constants/role.status-code.constant';
import {
  ENUM_DOC_REQUEST_BODY_TYPE,
  ENUM_DOC_RESPONSE_BODY_TYPE,
} from '../constants/doc.constant';
import {
  IDocDefaultOptions,
  IDocOfOptions,
  IDocOptions,
  IDocPagingOptions,
} from '../interfaces/doc.interface';

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

  if (options?.request?.params) {
    docs.push(...options?.request?.params.map((param) => ApiParam(param)));
  }

  if (options?.request?.queries) {
    docs.push(...options?.request?.queries.map((query) => ApiQuery(query)));
  }

  const oneOfUnauthorized: IDocOfOptions[] = [];
  const oneOfForbidden: IDocOfOptions[] = [];

  // auth
  const auths = [];
  if (options?.auth?.jwtRefreshToken) {
    auths.push(ApiBearerAuth('refreshToken'));
    oneOfUnauthorized.push({
      messagePath: 'auth.error.refreshTokenUnauthorized',
      statusCode: ENUM_AUTH_STATUS_CODE_ERROR.AUTH_JWT_REFRESH_TOKEN_ERROR,
    });
  }

  if (options?.auth?.jwtAccessToken) {
    auths.push(ApiBearerAuth('accessToken'));
    oneOfUnauthorized.push({
      messagePath: 'auth.error.accessTokenUnauthorized',
      statusCode: ENUM_AUTH_STATUS_CODE_ERROR.AUTH_JWT_ACCESS_TOKEN_ERROR,
    });
    oneOfForbidden.push({
      statusCode: ENUM_ROLE_STATUS_CODE_ERROR.ROLE_PAYLOAD_TYPE_INVALID_ERROR,
      messagePath: 'role.error.typeForbidden',
    });
  }

  if (options?.auth?.apiKey) {
    auths.push(ApiSecurity('apiKey'));
    oneOfUnauthorized.push(
      {
        statusCode: ENUM_API_KEY_STATUS_CODE_ERROR.API_KEY_NEEDED_ERROR,
        messagePath: 'apiKey.error.keyNeeded',
      },
      {
        statusCode: ENUM_API_KEY_STATUS_CODE_ERROR.API_KEY_NOT_FOUND_ERROR,
        messagePath: 'apiKey.error.notFound',
      },
      {
        statusCode: ENUM_API_KEY_STATUS_CODE_ERROR.API_KEY_INVALID_ERROR,
        messagePath: 'apiKey.error.invalid',
      },
    );
  }
  // request headers
  const requestHeaders = [];
  if (options?.requestHeader?.userAgent) {
    oneOfForbidden.push(
      {
        statusCode:
          ENUM_REQUEST_STATUS_CODE_ERROR.REQUEST_USER_AGENT_INVALID_ERROR,
        messagePath: 'request.error.userAgentInvalid',
      },
      {
        statusCode:
          ENUM_REQUEST_STATUS_CODE_ERROR.REQUEST_USER_AGENT_BROWSER_INVALID_ERROR,
        messagePath: 'request.error.userAgentBrowserInvalid',
      },
      {
        statusCode:
          ENUM_REQUEST_STATUS_CODE_ERROR.REQUEST_USER_AGENT_OS_INVALID_ERROR,
        messagePath: 'request.error.userAgentOsInvalid',
      },
    );
    requestHeaders.push({
      name: 'user-agent',
      description: 'User agent header',
      required: true,
      schema: {
        example:
          'Mozilla/5.0 (platform; rv:geckoversion) Gecko/geckotrail Firefox/firefoxversion',
        type: 'string',
      },
    });
  }

  if (options?.requestHeader?.timestamp) {
    oneOfForbidden.push({
      statusCode:
        ENUM_REQUEST_STATUS_CODE_ERROR.REQUEST_TIMESTAMP_INVALID_ERROR,
      messagePath: 'request.error.timestampInvalid',
    });
    requestHeaders.push({
      name: 'x-timestamp',
      description: 'Timestamp header, in microseconds',
      required: true,
      schema: {
        example: 1662876305642,
        type: 'number',
      },
    });
  }

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

    oneOfForbidden.length > 0
      ? DocOneOf(HttpStatus.FORBIDDEN, ...oneOfForbidden)
      : Skip(),
    oneOfUnauthorized.length > 0
      ? DocOneOf(HttpStatus.UNAUTHORIZED, ...oneOfUnauthorized)
      : Skip(),
    ...auths,
    ...docs,
  );
}

export function DocPaging<T>(
  messagePath: string,
  options: IDocPagingOptions<T>,
): MethodDecorator {
  // paging
  const docs = [];

  if (options?.request?.params) {
    docs.push(...options?.request?.params.map((param) => ApiParam(param)));
  }

  if (options?.request?.queries) {
    docs.push(...options?.request?.queries.map((query) => ApiQuery(query)));
  }

  const oneOfUnauthorized: IDocOfOptions[] = [];
  const oneOfForbidden: IDocOfOptions[] = [];

  // auth
  const auths = [];
  if (options?.auth?.jwtRefreshToken) {
    auths.push(ApiBearerAuth('refreshToken'));
    oneOfUnauthorized.push({
      messagePath: 'auth.error.refreshTokenUnauthorized',
      statusCode: ENUM_AUTH_STATUS_CODE_ERROR.AUTH_JWT_REFRESH_TOKEN_ERROR,
    });
  }

  if (options?.auth?.jwtAccessToken) {
    auths.push(ApiBearerAuth('accessToken'));
    oneOfUnauthorized.push({
      messagePath: 'auth.error.accessTokenUnauthorized',
      statusCode: ENUM_AUTH_STATUS_CODE_ERROR.AUTH_JWT_ACCESS_TOKEN_ERROR,
    });
    oneOfForbidden.push({
      statusCode: ENUM_ROLE_STATUS_CODE_ERROR.ROLE_PAYLOAD_TYPE_INVALID_ERROR,
      messagePath: 'role.error.typeForbidden',
    });
  }

  if (options?.auth?.apiKey) {
    auths.push(ApiSecurity('apiKey'));
    oneOfUnauthorized.push(
      {
        statusCode: ENUM_API_KEY_STATUS_CODE_ERROR.API_KEY_NEEDED_ERROR,
        messagePath: 'apiKey.error.keyNeeded',
      },
      {
        statusCode: ENUM_API_KEY_STATUS_CODE_ERROR.API_KEY_NOT_FOUND_ERROR,
        messagePath: 'apiKey.error.notFound',
      },
      {
        statusCode: ENUM_API_KEY_STATUS_CODE_ERROR.API_KEY_INVALID_ERROR,
        messagePath: 'apiKey.error.invalid',
      },
    );
  }

  // request headers
  const requestHeaders = [];
  if (options?.requestHeader?.userAgent) {
    oneOfForbidden.push(
      {
        statusCode:
          ENUM_REQUEST_STATUS_CODE_ERROR.REQUEST_USER_AGENT_INVALID_ERROR,
        messagePath: 'request.error.userAgentInvalid',
      },
      {
        statusCode:
          ENUM_REQUEST_STATUS_CODE_ERROR.REQUEST_USER_AGENT_BROWSER_INVALID_ERROR,
        messagePath: 'request.error.userAgentBrowserInvalid',
      },
      {
        statusCode:
          ENUM_REQUEST_STATUS_CODE_ERROR.REQUEST_USER_AGENT_OS_INVALID_ERROR,
        messagePath: 'request.error.userAgentOsInvalid',
      },
    );
    requestHeaders.push({
      name: 'user-agent',
      description: 'User agent header',
      required: true,
      schema: {
        example:
          'Mozilla/5.0 (platform; rv:geckoversion) Gecko/geckotrail Firefox/firefoxversion',
        type: 'string',
      },
    });
  }

  if (options?.requestHeader?.timestamp) {
    oneOfForbidden.push({
      statusCode:
        ENUM_REQUEST_STATUS_CODE_ERROR.REQUEST_TIMESTAMP_INVALID_ERROR,
      messagePath: 'request.error.timestampInvalid',
    });
    requestHeaders.push({
      name: 'x-timestamp',
      description: 'Timestamp header, in microseconds',
      required: true,
      schema: {
        example: 1662876305642,
        type: 'number',
      },
    });
  }

  return applyDecorators(
    // paging
    ApiConsumes('application/json'),
    ApiExtraModels(ResponsePagingSerialization<T>),
    ApiExtraModels(options.response.serialization),
    ApiResponse({
      status: HttpStatus.OK,
      schema: {
        allOf: [{ $ref: getSchemaPath(ResponsePagingSerialization<T>) }],
        properties: {
          message: {
            example: messagePath,
          },
          statusCode: {
            type: 'number',
            example: options.response.statusCode ?? HttpStatus.OK,
          },
          data: {
            type: 'array',
            items: {
              $ref: getSchemaPath(options.response.serialization),
            },
          },
        },
      },
    }),
    ApiQuery({
      name: 'search',
      required: false,
      allowEmptyValue: true,
      type: 'string',
      description:
        'Search will base on _availableSearch with rule contains, and case insensitive',
    }),
    ApiQuery({
      name: 'perPage',
      required: false,
      allowEmptyValue: true,
      example: 20,
      type: 'number',
      description: 'Data per page',
    }),
    ApiQuery({
      name: 'page',
      required: false,
      allowEmptyValue: true,
      example: 1,
      type: 'number',
      description: 'page number',
    }),
    ApiQuery({
      name: 'orderBy',
      required: false,
      allowEmptyValue: true,
      example: 'createdAt',
      type: 'string',
      description: 'Order by base on _availableOrderBy',
    }),
    ApiQuery({
      name: 'orderDirection',
      required: false,
      allowEmptyValue: true,
      example: ENUM_PAGINATION_ORDER_DIRECTION_TYPE.ASC,
      enum: ENUM_PAGINATION_ORDER_DIRECTION_TYPE,
      type: 'string',
      description: 'Order direction base on _availableOrderDirection',
    }),

    // default
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
    ApiHeaders(requestHeaders),
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
    oneOfForbidden.length > 0
      ? DocOneOf(HttpStatus.FORBIDDEN, ...oneOfForbidden)
      : Skip(),
    oneOfUnauthorized.length > 0
      ? DocOneOf(HttpStatus.UNAUTHORIZED, ...oneOfUnauthorized)
      : Skip(),
    ...auths,
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

export function DocOneOf<T>(
  httpStatus: HttpStatus,
  ...documents: IDocOfOptions[]
): MethodDecorator {
  const docs = [];
  const oneOf = [];

  for (const doc of documents) {
    const oneOfSchema: Record<string, any> = {
      allOf: [{ $ref: getSchemaPath(ResponseDefaultSerialization<T>) }],
      properties: {
        message: {
          example: doc.messagePath,
        },
        statusCode: {
          type: 'number',
          example: doc.statusCode ?? HttpStatus.OK,
        },
      },
    };

    if (doc.serialization) {
      docs.push(ApiExtraModels(doc.serialization));
      oneOfSchema.properties = {
        ...oneOfSchema.properties,
        data: {
          $ref: getSchemaPath(doc.serialization),
        },
      };
    }

    oneOf.push(oneOfSchema);
  }

  return applyDecorators(
    ApiExtraModels(ResponseDefaultSerialization<T>),
    ApiResponse({
      status: httpStatus,
      schema: {
        oneOf,
      },
    }),
    ...docs,
  );
}
