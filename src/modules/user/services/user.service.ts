import { Injectable } from '@nestjs/common';
import { IAuthPassword } from 'src/common/auth/interfaces/auth.interface';
import { HelperDateService } from 'src/common/helper/services/helper.date.service';
import { UserCreateDto } from '../dtos/user.create.dto';
import { IUserService } from '../interfaces/user.service.interface';
import { UserDoc, UserEntity } from '../repository/entities/user.entity';
import { UserRepository } from '../repository/repositories/user.repository';

@Injectable()
export class UserService implements IUserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly helperDateService: HelperDateService,
  ) {}

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

  async findOneById<T>(_id: string): Promise<T> {
    return this.userRepository.findOneById<T>(_id);
  }
  // async checkExist(
  //   email: string,
  //   mobileNumber: string,
  // ): Promise<IUserCheckExist> {
  //   const [existEmail, existMobileNumber] = await Promise.all([
  //     this.userRepository.exists({
  //       email: { $regex: new RegExp(email), $options: 'i' },
  //     }),
  //     this.userRepository.exists({ mobileNumber }),
  //   ]);

  //   return {
  //     email: Boolean(existEmail),
  //     mobileNumber: Boolean(existMobileNumber),
  //   };
  // }

  // // TODO: populate role
  // async findOneById<T>(_id: string): Promise<T> {
  //   const user = this.userRepository.findById(_id);
  //   return user.lean();
  // }

  // async payloadSerialization(
  //   data: IUserDocument,
  // ): Promise<UserPayloadSerialization> {
  //   return plainToInstance(UserPayloadSerialization, data);
  // }

  // async deleteMany(
  //     find: Record<string, any>,
  //     options?: IDatabaseManyOptions
  // ): Promise<boolean> {
  //     return this.userModel.deleteMany(find, options);
  // }
}
