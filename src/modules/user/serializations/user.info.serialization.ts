import { faker } from '@faker-js/faker';
import { ApiProperty, OmitType } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { AwsS3Serialization } from 'src/common/aws/serializations/aws.s3.serialization';
import { ENUM_ROLE_TYPE } from 'src/modules/role/constants/role.enum.constant';
import { ENUM_USER_SIGN_UP_FROM } from '../constants/user.enum.constant';
import { UserProfileSerialization } from './user.profile.serialization';
import { UserPayloadPermissionSerialization } from './user.payload.serialization';

export class UserInfoSerialization extends OmitType(UserProfileSerialization, [
  'photo',
  'role',
  'signUpDate',
  'createdAt',
  'updatedAt',
  'username',
  'mobileNumber',
  'signUpFrom',
] as const) {
  @Exclude()
  readonly username: string;

  @Exclude()
  readonly mobileNumber: string;

  @Exclude()
  readonly photo?: AwsS3Serialization;

  @ApiProperty({
    example: faker.datatype.uuid(),
    type: 'string',
  })
  readonly role: string;

  @ApiProperty({
    example: ENUM_ROLE_TYPE.ADMIN,
    type: 'string',
    enum: ENUM_ROLE_TYPE,
  })
  @Expose()
  readonly type: ENUM_ROLE_TYPE;

  @ApiProperty({
    type: () => UserPayloadPermissionSerialization,
    isArray: true,
  })
  @Expose()
  readonly permissions: UserPayloadPermissionSerialization[];

  @Exclude()
  readonly signUpDate: Date;

  @Exclude()
  readonly signUpFrom: ENUM_USER_SIGN_UP_FROM;

  @Exclude()
  readonly loginDate: Date;

  @Exclude()
  readonly createdAt: number;

  @Exclude()
  readonly updatedAt: number;
}
