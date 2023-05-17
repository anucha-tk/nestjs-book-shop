import { IAuthPassword } from 'src/common/auth/interfaces/auth.interface';
import {
  IDatabaseFindAllOptions,
  IDatabaseFindOneOptions,
  IDatabaseSaveOptions,
} from 'src/common/database/interfaces/database.interface';
import { UserCreateDto } from '../dtos/user.create.dto';
import { UserDoc } from '../repository/entities/user.entity';
import { UserPayloadSerialization } from '../serializations/user.payload.serialization';
import { IUserDoc, IUserEntity } from './user.interface';

export interface IUserService {
  findAll(
    find?: Record<string, any>,
    options?: IDatabaseFindAllOptions,
  ): Promise<IUserEntity[]>;
  findOneById<T>(_id: string, options?: IDatabaseFindOneOptions): Promise<T>;
  create(
    { firstName, lastName, email, mobileNumber, role }: UserCreateDto,
    { passwordExpired, passwordHash, salt }: IAuthPassword,
  ): Promise<UserDoc>;
  findOneByEmail<T>(email: string): Promise<T>;
  increasePasswordAttempt(repository: UserDoc): Promise<UserDoc>;
  joinWithRole(repository: UserDoc): Promise<IUserDoc>;
  resetPasswordAttempt(repository: UserDoc): Promise<UserDoc>;
  payloadSerialization(data: IUserDoc): Promise<UserPayloadSerialization>;
  updatePassword(
    repository: UserDoc,
    { passwordHash, passwordExpired, salt, passwordCreated }: IAuthPassword,
    options?: IDatabaseSaveOptions,
  ): Promise<UserDoc>;
  inactivePermanent(
    repository: UserDoc,
    options?: IDatabaseSaveOptions,
  ): Promise<UserDoc>;
}
