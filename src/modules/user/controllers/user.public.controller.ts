import {
  Body,
  ConflictException,
  Controller,
  InternalServerErrorException,
  Post,
} from '@nestjs/common';
import { AuthService } from 'src/common/auth/services/auth.service';
import { ENUM_ERROR_STATUS_CODE_ERROR } from 'src/common/error/error.status-code.constant';
import { Response } from 'src/common/response/decorators/response.decorator';
import { ENUM_USER_STATUS_CODE_ERROR } from '../constants/user.status-code';
import { UserSignupDto } from '../dtos/user.sign-up.dto';
import { UserService } from '../services/user.service';

@Controller({ version: '1', path: '/user' })
export class UserPublicController {
  constructor(
    private userService: UserService,
    private authService: AuthService,
  ) {}

  @Response('user.signUp')
  @Post('/sign-up')
  async signup(
    @Body()
    { username, email, mobileNumber, ...body }: UserSignupDto,
  ) {
    //TODO: return type IResponse
    // TODO: check role = user

    const [usernameExist, emailExist, mobileNumberExist] = await Promise.all([
      this.userService.existByUsername(username),
      this.userService.existByEmail(email),
      this.userService.existByMobileNumber(mobileNumber),
    ]);

    switch (true) {
      case usernameExist:
        throw new ConflictException({
          statusCode: ENUM_USER_STATUS_CODE_ERROR.USER_USERNAME_EXISTS_ERROR,
          message: 'user.error.usernameExist',
        });
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
          username,
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
