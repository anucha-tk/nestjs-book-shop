import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class UserEntity {
  @Prop({
    required: true,
    index: true,
    lowercase: true,
    trim: true,
  })
  firstName: string;

  @Prop({
    required: true,
    index: true,
    lowercase: true,
    trim: true,
  })
  lastName: string;

  @Prop({
    required: true,
    index: true,
    unique: true,
    trim: true,
  })
  mobileNumber: string;

  @Prop({
    required: true,
    index: true,
    unique: true,
    lowercase: true,
    trim: true,
  })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  salt: string;

  @Prop({ required: true })
  passwordExpired: Date;

  @Prop({
    default: true,
  })
  isActive: boolean;
}

export const UserDatabaseName = 'users';
export const UserSchema = SchemaFactory.createForClass(UserEntity);
export type UserDocument = UserEntity & Document;

//TODO: test lowercase, if not pre hook
