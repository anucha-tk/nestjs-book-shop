import { Exclude, Type } from 'class-transformer';

export class UserGetSerialization {
  @Type(() => String)
  readonly _id: string;

  // TODO: Transform role

  readonly email: string;
  readonly mobileNumber: string;
  readonly isActive: boolean;
  readonly firstName: string;
  readonly lastName: string;

  @Exclude()
  readonly password: string;

  readonly passwordExpired: Date;

  @Exclude()
  readonly salt: string;

  readonly createdAt: Date;

  @Exclude()
  readonly updatedAt: Date;
}
