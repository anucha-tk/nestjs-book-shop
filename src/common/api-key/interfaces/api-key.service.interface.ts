import { ApiKeyCreateRawDto } from '../dtos/api-key.create.dto';
import { ApiKeyDoc } from '../repository/entities/api-key.entity';
import { IApiKeyCreated } from './api-key.interface';

export interface IApiKeyService {
  findOneByActiveKey(key: string): Promise<ApiKeyDoc>;

  createRaw({
    name,
    key,
    secret,
    startDate,
    endDate,
  }: ApiKeyCreateRawDto): Promise<IApiKeyCreated>;

  deleteMany(find: Record<string, any>): Promise<boolean>;

  validateHashApiKey(hashFromRequest: string, hash: string): Promise<boolean>;

  createHashApiKey(key: string, secret: string): Promise<string>;
}
