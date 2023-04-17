import { Type } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { PasswordConfirmMatch } from '../validators/password-confirm.validator';

/**
 * Data transfer object for user sign-up information.
 * @property {string} username
 * @property email User's email address. Example: user@example.com
 * @property firstName User's first name. Example: John
 * @property lastName User's last name. Example: Doe
 * @property mobileNumber User's mobile number. Example: 555-555-5555
 * @property password User's password. Example: 12345678
 * @property passwordConfirm User's confirmed password. Example: 12345678
 */
export class UserSignupDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  @MaxLength(30)
  @Type(() => String)
  username: string;

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
  @PasswordConfirmMatch('password', { message: 'Passwords do not match' })
  passwordConfirm: string;
}
