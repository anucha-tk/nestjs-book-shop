import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { DatabaseMongoUUIDRepositoryAbstract } from 'src/common/database/abstracts/mongo/repositories/database.mongo.uuid.repository.abstract';
import { DatabaseModel } from 'src/common/database/decorators/database.decorator';
import { UserDoc, UserEntity } from '../entities/user.entity';

@Injectable()
export class UserRepository extends DatabaseMongoUUIDRepositoryAbstract<
  UserEntity,
  UserDoc
> {
  constructor(
    @DatabaseModel(UserEntity.name)
    private readonly userModel: Model<UserEntity>,
  ) {
    //TODO: on future make roleEntity and add role
    super(userModel);
  }
}
