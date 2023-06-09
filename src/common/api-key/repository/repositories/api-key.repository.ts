import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { DatabaseMongoUUIDRepositoryAbstract } from 'src/common/database/abstracts/mongo/repositories/database.mongo.uuid.repository.abstract';
import { DatabaseModel } from 'src/common/database/decorators/database.decorator';
import { ApiKeyDoc, ApiKeyEntity } from '../entities/api-key.entity';

@Injectable()
export class ApiKeyRepository extends DatabaseMongoUUIDRepositoryAbstract<
  ApiKeyEntity,
  ApiKeyDoc
> {
  constructor(
    @DatabaseModel(ApiKeyEntity.name)
    private readonly apiKeyDoc: Model<ApiKeyEntity>,
  ) {
    super(apiKeyDoc);
  }
}
