import { UserCreateDto } from './dto/user.create.dto';
import { UserDocument } from './schemas/user.schema';

// TODO: make omit role
export type IUserDocument = UserDocument;

export interface IUserCreate extends UserCreateDto {
  passwordExpired: Date;
  salt: string;
}

export interface IUserCheckExist {
  email: boolean;
  mobileNumber: boolean;
}
