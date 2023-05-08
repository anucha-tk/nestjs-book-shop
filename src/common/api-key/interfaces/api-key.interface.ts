import { ENUM_API_KEY_TYPE } from '../constants/api-key.enum.constant';
import { ApiKeyDoc } from '../repository/entities/api-key.entity';

export interface IApiKeyPayload {
  _id: string;
  key: string;
  name: string;
  type: ENUM_API_KEY_TYPE;
}

export interface IApiKeyCreated {
  secret: string;
  doc: ApiKeyDoc;
}
