import { Type } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UserCreateDto {
  @IsNotEmpty()
  @MaxLength(100)
  @IsEmail()
  @Type(() => String)
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  @MaxLength(30)
  @Type(() => String)
  firstName: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  @MaxLength(30)
  @Type(() => String)
  lastName: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(9)
  @MaxLength(14)
  @Type(() => String)
  mobileNumber: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  @MaxLength(30)
  @Type(() => String)
  password: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  @MaxLength(30)
  @Type(() => String)
  passwordConfirm: string;
}
