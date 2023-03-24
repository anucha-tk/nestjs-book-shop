import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserDocument, UserEntity } from '../schemas/user.schema';
import { UserCreateDto } from '../dto/user.create.dto';
import { IUserCheckExist } from '../user.interface';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(UserEntity.name) private userModel: Model<UserDocument>,
  ) {}

  async create(userCreateDto: UserCreateDto): Promise<UserDocument> {
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
}
