import {
  RoleDoc,
  RoleEntity,
} from 'src/modules/role/repository/entities/role.entity';
import { UserDoc, UserEntity } from '../repository/entities/user.entity';

export interface IUserGoogleEntity {
  accessToken: string;
  refreshToken: string;
}

/**
 * @description UserDoc with populate RoleDoc
 * */
export interface IUserDoc extends Omit<UserDoc, 'role'> {
  role: RoleDoc;
}

/**
 * @description UserEntity with populate RoleEntity
 * */
export interface IUserEntity extends Omit<UserEntity, 'role'> {
  role: RoleEntity;
}
