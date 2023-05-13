import {
  Body,
  ConflictException,
  Controller,
  InternalServerErrorException,
  Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from 'src/common/auth/services/auth.service';
import { ENUM_ERROR_STATUS_CODE_ERROR } from 'src/common/error/constants/error.status-code.constant';
import { Response } from 'src/common/response/decorators/response.decorator';
import { RoleService } from 'src/modules/role/services/role.service';
import { ENUM_USER_SIGN_UP_FROM } from '../constants/user.enum.constant';
import { ENUM_USER_STATUS_CODE_ERROR } from '../constants/user.status-code';
import { UserPublicSignUpDoc } from '../docs/user.public.doc';
import { UserSignUpDto } from '../dtos/user.sign-up.dto';
import { UserService } from '../services/user.service';

@ApiTags('modules.public.user')
@Controller({ version: '1', path: '/user' })
export class UserPublicController {
  constructor(
    private userService: UserService,
    private authService: AuthService,
    private readonly roleService: RoleService,
  ) {}

  @UserPublicSignUpDoc()
  @Response('user.signUp')
  @Post('/sign-up')
  async signUp(
    @Body()
    { email, mobileNumber, ...body }: UserSignUpDto,
  ): Promise<void> {
    const promises: Promise<any>[] = [
      this.roleService.findOneByName('user'),
      this.userService.existByEmail(email),
    ];

    if (mobileNumber) {
      promises.push(this.userService.existByMobileNumber(mobileNumber));
    }

    const [role, emailExist, mobileNumberExist] = await Promise.all(promises);

    if (emailExist) {
      throw new ConflictException({
        statusCode: ENUM_USER_STATUS_CODE_ERROR.USER_EMAIL_EXIST_ERROR,
        message: 'user.error.emailExist',
      });
    } else if (mobileNumberExist) {
      throw new ConflictException({
        statusCode: ENUM_USER_STATUS_CODE_ERROR.USER_MOBILE_NUMBER_EXIST_ERROR,
        message: 'user.error.mobileNumberExist',
      });
    }

    try {
      const password = await this.authService.createPassword(body.password);

      await this.userService.create(
        {
          email,
          mobileNumber,
          signUpFrom: ENUM_USER_SIGN_UP_FROM.LOCAL,
          role: role._id,
          ...body,
        },
        password,
      );

      return;
    } catch (err: any) {
      throw new InternalServerErrorException({
        statusCode: ENUM_ERROR_STATUS_CODE_ERROR.ERROR_UNKNOWN,
        message: 'http.serverError.internalServerError',
        _error: err.message,
      });
    }
  }
}
