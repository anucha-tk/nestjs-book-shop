import { OmitType } from '@nestjs/mapped-types';
import { UserSignupDto } from './user.sign-up.dto';

export class UserCreateDto extends OmitType(UserSignupDto, [
  'passwordConfirm',
] as const) {}
