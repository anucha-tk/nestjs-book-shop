import { Injectable } from '@nestjs/common';
import { HelperDateService } from 'src/common/helper/services/helper.date.service';
import { HelperHashService } from 'src/common/helper/services/helper.hash.service';
import { ApiKeyCreateRawDto } from '../dtos/api-key.create.dto';
import { IApiKeyCreated } from '../interfaces/api-key.interface';
import { IApiKeyService } from '../interfaces/api-key.service.interface';
import { ApiKeyDoc, ApiKeyEntity } from '../repository/entities/api-key.entity';
import { ApiKeyRepository } from '../repository/repositories/api-key.repository';

@Injectable()
export class ApiKeyService implements IApiKeyService {
  constructor(
    private readonly apiKeyRepository: ApiKeyRepository,
    private readonly helperHashService: HelperHashService,
    private readonly helperDateService: HelperDateService,
  ) {}

  async findOneByActiveKey(key: string): Promise<ApiKeyDoc> {
    return this.apiKeyRepository.findOne<ApiKeyDoc>({
      key,
      isActive: true,
    });
  }

  async createHashApiKey(key: string, secret: string): Promise<string> {
    return this.helperHashService.sha256(`${key}:${secret}`);
  }

  async validateHashApiKey(
    hashFromRequest: string,
    hash: string,
  ): Promise<boolean> {
    return this.helperHashService.sha256Compare(hashFromRequest, hash);
  }

  async createRaw({
    name,
    key,
    type,
    secret,
    startDate,
    endDate,
  }: ApiKeyCreateRawDto): Promise<IApiKeyCreated> {
    const hash: string = await this.createHashApiKey(key, secret);

    const dto: ApiKeyEntity = new ApiKeyEntity();
    dto.name = name;
    dto.key = key;
    dto.hash = hash;
    dto.isActive = true;
    dto.type = type;

    if (startDate && endDate) {
      dto.startDate = this.helperDateService.startOfDay(startDate);
      dto.endDate = this.helperDateService.endOfDay(endDate);
    }

    const created: ApiKeyDoc = await this.apiKeyRepository.create<ApiKeyEntity>(
      dto,
    );

    return { doc: created, secret };
  }

  async deleteMany(find: Record<string, any>): Promise<boolean> {
    return this.apiKeyRepository.deleteMany(find);
  }
}
