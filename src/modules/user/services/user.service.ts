import { Injectable } from '@nestjs/common';
import { IAuthPassword } from 'src/common/auth/interfaces/auth.interface';
import { UserCreateDto } from '../dtos/user.create.dto';
import { UserEntity } from '../repository/entities/user.entity';
import { UserRepository } from '../repository/repositories/user.repository';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async create(
    { firstName, lastName, email, mobileNumber }: UserCreateDto,
    { salt, passwordHash, passwordExpired }: IAuthPassword,
  ): Promise<UserEntity> {
    const create: UserEntity = new UserEntity();
    create.firstName = firstName;
    create.lastName = lastName;
    create.email = email;
    create.salt = salt;
    create.isActive = true;
    create.password = passwordHash;
    create.passwordExpired = passwordExpired;
    create.mobileNumber = mobileNumber;
    return this.userRepository.create(create);
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
