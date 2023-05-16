import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { IAuthPassword } from 'src/common/auth/interfaces/auth.interface';
import { IDatabaseFindOneOptions } from 'src/common/database/interfaces/database.interface';
import { HelperDateService } from 'src/common/helper/services/helper.date.service';
import { RoleEntity } from 'src/modules/role/repository/entities/role.entity';
import { UserCreateDto } from '../dtos/user.create.dto';
import { IUserDoc } from '../interfaces/user.interface';
import { IUserService } from '../interfaces/user.service.interface';
import { UserDoc, UserEntity } from '../repository/entities/user.entity';
import { UserRepository } from '../repository/repositories/user.repository';
import { UserPayloadSerialization } from '../serializations/user.payload.serialization';

@Injectable()
export class UserService implements IUserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly helperDateService: HelperDateService,
  ) {}

  async findOneByEmail<T>(email: string): Promise<T> {
    return this.userRepository.findOne<T>({ email });
  }

  async create(
    {
      firstName,
      lastName,
      email,
      mobileNumber,
      role,
      signUpFrom,
    }: UserCreateDto,
    { passwordExpired, passwordHash, salt, passwordCreated }: IAuthPassword,
  ): Promise<UserDoc> {
    const create: UserEntity = new UserEntity();
    create.firstName = firstName;
    create.email = email;
    create.password = passwordHash;
    create.role = role;
    create.isActive = true;
    create.inactivePermanent = false;
    create.blocked = false;
    create.lastName = lastName;
    create.salt = salt;
    create.passwordExpired = passwordExpired;
    create.passwordCreated = passwordCreated;
    create.signUpDate = this.helperDateService.create();
    create.passwordAttempt = 0;
    create.mobileNumber = mobileNumber ?? undefined;
    create.signUpFrom = signUpFrom;

    return this.userRepository.create<UserEntity>(create);
  }

  async existByEmail(email: string): Promise<boolean> {
    return this.userRepository.exists({
      email: {
        $regex: new RegExp(email),
        $options: 'i',
      },
    });
  }

  async existByMobileNumber(mobileNumber: string): Promise<boolean> {
    return this.userRepository.exists({
      mobileNumber,
    });
  }

  async deleteMany(find: Record<string, any>): Promise<boolean> {
    return this.userRepository.deleteMany(find);
  }

  async findOneById<T>(
    _id: string,
    options?: IDatabaseFindOneOptions,
  ): Promise<T> {
    return this.userRepository.findOneById<T>(_id, options);
  }

  async increasePasswordAttempt(repository: UserDoc): Promise<UserDoc> {
    repository.passwordAttempt = ++repository.passwordAttempt;

    return this.userRepository.save(repository);
  }

  async joinWithRole(repository: UserDoc): Promise<IUserDoc> {
    return repository.populate({
      path: 'role',
      localField: 'role',
      foreignField: '_id',
      model: RoleEntity.name,
    });
  }

  async resetPasswordAttempt(repository: UserDoc): Promise<UserDoc> {
    repository.passwordAttempt = 0;

    return this.userRepository.save(repository);
  }

  async payloadSerialization(
    data: IUserDoc,
  ): Promise<UserPayloadSerialization> {
    return plainToInstance(UserPayloadSerialization, data.toObject());
  }
}
