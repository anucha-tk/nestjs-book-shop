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
import { ENUM_USER_STATUS_CODE_ERROR } from '../constants/user.status-code';
import { UserSignUpDoc } from '../docs/user.public.doc';
import { UserSignupDto } from '../dtos/user.sign-up.dto';
import { UserService } from '../services/user.service';

@ApiTags('modules.public.user')
@Controller({ version: '1', path: '/user' })
export class UserPublicController {
  constructor(
    private userService: UserService,
    private authService: AuthService,
  ) {}

  @UserSignUpDoc()
  @Response('user.signUp')
  @Post('/sign-up')
  async signup(
    @Body()
    { email, mobileNumber, ...body }: UserSignupDto,
  ): Promise<void> {
    // TODO: add role

    const [emailExist, mobileNumberExist] = await Promise.all([
      this.userService.existByEmail(email),
      this.userService.existByMobileNumber(mobileNumber),
    ]);

    switch (true) {
      case emailExist:
        throw new ConflictException({
          statusCode: ENUM_USER_STATUS_CODE_ERROR.USER_EMAIL_EXIST_ERROR,
          message: 'user.error.emailExist',
        });
      case mobileNumberExist:
        throw new ConflictException({
          statusCode:
            ENUM_USER_STATUS_CODE_ERROR.USER_MOBILE_NUMBER_EXIST_ERROR,
          message: 'user.error.mobileNumberExist',
        });
      default:
        break;
    }

    try {
      const password = await this.authService.createPassword(body.password);

      await this.userService.create(
        {
          email,
          mobileNumber,
          ...body,
        },
        password,
      );
      return;
    } catch (err: any) {
      throw new InternalServerErrorException({
        statusCode: ENUM_ERROR_STATUS_CODE_ERROR.ERROR_UNKNOWN,
        message: 'http.serverError.internalServerError',
        error: err.message,
      });
    }
  }
}
