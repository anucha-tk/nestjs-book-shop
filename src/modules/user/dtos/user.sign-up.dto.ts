import { faker } from '@faker-js/faker';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { IsPasswordStrong } from 'src/common/request/validations/request.is-password-strong.validation';
import { PasswordConfirmMatch } from '../validators/password-confirm.validator';

/**
 * Data transfer object for user sign-up information.
 * @property email User's email address. Example: user@example.com
 * @property firstName User's first name. Example: John
 * @property lastName User's last name. Example: Doe
 * @property mobileNumber User's mobile number. Example: 555-555-5555
 * @property password User's password. Example: 12345678
 * @property passwordConfirm User's confirmed password. Example: 12345678
 */
export class UserSignupDto {
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
  @IsNotEmpty()
  @MinLength(9)
  @MaxLength(14)
  @Type(() => String)
  mobileNumber: string;

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
}
