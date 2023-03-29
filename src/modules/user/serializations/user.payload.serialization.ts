import { OmitType } from '@nestjs/mapped-types';
import { UserGetSerialization } from './user.get.serialization';

// NOTE: can omit type eg. photo here
export class UserPayloadSerialization extends UserGetSerialization {}
