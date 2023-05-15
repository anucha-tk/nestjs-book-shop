import { RoleDoc } from 'src/modules/role/repository/entities/role.entity';
import { UserDoc } from '../repository/entities/user.entity';

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
