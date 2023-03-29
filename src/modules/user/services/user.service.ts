import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { plainToInstance } from 'class-transformer';
import { Model } from 'mongoose';
import { UserDocument, UserEntity } from '../schemas/user.schema';
import { UserPayloadSerialization } from '../serializations/user.payload.serialization';
import { IUserCheckExist, IUserCreate, IUserDocument } from '../user.interface';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(UserEntity.name) private userModel: Model<UserDocument>,
  ) {}

  async create(userCreateDto: IUserCreate): Promise<UserDocument> {
    return new this.userModel(userCreateDto).save();
  }

  async checkExist(
    email: string,
    mobileNumber: string,
  ): Promise<IUserCheckExist> {
    const [existEmail, existMobileNumber] = await Promise.all([
      this.userModel.exists({
        email: { $regex: new RegExp(email), $options: 'i' },
      }),
      this.userModel.exists({ mobileNumber }),
    ]);

    return {
      email: Boolean(existEmail),
      mobileNumber: Boolean(existMobileNumber),
    };
  }

  // TODO: populate role
  async findOneById<T>(_id: string): Promise<T> {
    const user = this.userModel.findById(_id);
    return user.lean();
  }

  async payloadSerialization(
    data: IUserDocument,
  ): Promise<UserPayloadSerialization> {
    return plainToInstance(UserPayloadSerialization, data);
  }
}
