import { Prop } from '@nestjs/mongoose';
import {
  DATABASE_CREATED_AT_FIELD_NAME,
  DATABASE_DELETED_AT_FIELD_NAME,
  DATABASE_UPDATED_AT_FIELD_NAME,
} from 'src/common/database/constants/database.constant';
import { DatabaseDefaultUUID } from 'src/common/database/constants/database.function.constant';
import { IDatabaseBaseEntity } from 'src/common/database/interfaces/database.entity.interface';
import { DatabaseBaseEntityAbstract } from '../../database.base-entity.abstract';

export abstract class DatabaseMongoUUIDEntityAbstract
  extends DatabaseBaseEntityAbstract
  implements IDatabaseBaseEntity<string>
{
  @Prop({
    type: String,
    default: DatabaseDefaultUUID,
  })
  _id: string;

  @Prop({
    required: false,
    index: true,
    type: Date,
  })
  [DATABASE_DELETED_AT_FIELD_NAME]?: Date;

  @Prop({
    required: false,
    index: 'asc',
    type: Date,
  })
  [DATABASE_CREATED_AT_FIELD_NAME]?: Date;

  @Prop({
    required: false,
    index: 'desc',
    type: Date,
  })
  [DATABASE_UPDATED_AT_FIELD_NAME]?: Date;
}
