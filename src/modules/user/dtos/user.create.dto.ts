import { faker } from '@faker-js/faker';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
  ValidateIf,
} from 'class-validator';
import { IsPasswordStrong } from 'src/common/request/validations/request.is-password-strong.validation';
import { ENUM_USER_SIGN_UP_FROM } from '../constants/user.enum.constant';
import { PasswordConfirmMatch } from '../validators/password-confirm.validator';

export class UserCreateDto {
  @ApiProperty({
    example: faker.internet.email(),
    required: true,
  })
  @IsNotEmpty()
  @MaxLength(100)
  @IsEmail()
  @Type(() => String)
  email: string;

  @ApiProperty({
    example: faker.name.firstName(),
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  @MaxLength(30)
  @Type(() => String)
  firstName: string;

  @ApiProperty({
    example: faker.name.lastName(),
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  @MaxLength(30)
  @Type(() => String)
  lastName: string;

  @ApiProperty({
    example: faker.phone.number('62812#########'),
    required: true,
  })
  @IsString()
  @IsOptional()
  @MinLength(10)
  @MaxLength(14)
  @ValidateIf((e) => e.mobileNumber !== '')
  @Type(() => String)
  readonly mobileNumber?: string;

  @ApiProperty({
    description:
      'string password must have one of A-Z, a-z, 0-9, and special character #?!@$%^&*-',
    example: 'yo818QKSJP@@!123',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  @MaxLength(30)
  @IsPasswordStrong()
  @Type(() => String)
  password: string;

  @ApiProperty({
    description:
      'string password must have one of A-Z, a-z, 0-9, and special character #?!@$%^&*-',
    example: 'yo818QKSJP@@!123',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  @MaxLength(30)
  @Type(() => String)
  @PasswordConfirmMatch('password', { message: 'Passwords do not match' })
  passwordConfirm: string;

  @ApiProperty({
    example: faker.datatype.uuid(),
    required: true,
  })
  @IsNotEmpty()
  @IsUUID('4')
  readonly role: string;

  @IsEnum(ENUM_USER_SIGN_UP_FROM)
  @IsString()
  @IsNotEmpty()
  readonly signUpFrom: ENUM_USER_SIGN_UP_FROM;
}
