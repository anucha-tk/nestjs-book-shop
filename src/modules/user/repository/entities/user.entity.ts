import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { DatabaseMongoUUIDEntityAbstract } from 'src/common/database/abstracts/mongo/entities/database.mongo.uuid.entity.abstract';
import { DatabaseEntity } from 'src/common/database/decorators/database.decorator';

export const UserDatabaseName = 'users';

/**
 * UserEntity build from nestjs mongoose
 * @property firstName
 * @property lastName
 * @property mobileNumber
 * @property email
 * @property password
 * @property salt
 * @property passwordExpired
 * @property isActive
 */
@DatabaseEntity({ collection: UserDatabaseName })
export class UserEntity extends DatabaseMongoUUIDEntityAbstract {
  @Prop({
    required: true,
    index: true,
    lowercase: true,
    trim: true,
  })
  firstName: string;

  @Prop({
    required: true,
    index: true,
    lowercase: true,
    trim: true,
  })
  lastName: string;

  @Prop({
    required: true,
    index: true,
    unique: true,
    trim: true,
  })
  mobileNumber: string;

  @Prop({
    required: true,
    index: true,
    unique: true,
    lowercase: true,
    trim: true,
  })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  salt: string;

  @Prop({ required: true })
  passwordExpired: Date;

  @Prop({
    default: true,
  })
  isActive: boolean;
}

export const UserSchema = SchemaFactory.createForClass(UserEntity);
