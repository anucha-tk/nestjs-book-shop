import {
  BadRequestException,
  Body,
  Controller,
  InternalServerErrorException,
  Post,
} from '@nestjs/common';
import { AuthService } from 'src/common/auth/services/auth.service';
import { ENUM_ERROR_STATUS_CODE_ERROR } from 'src/common/error/error.status-code.constant';
import { ENUM_USER_STATUS_CODE_ERROR } from '../constants/user.status-code';
import { UserCreateDto } from '../dto/user.create.dto';
import { UserService } from '../services/user.service';

@Controller('user')
export class UserPublicController {
  constructor(
    private userService: UserService,
    private authService: AuthService,
  ) {}

  //TODO: make @response
  @Post('/sign-up')
  async signup(
    @Body()
    { email, mobileNumber, ...body }: UserCreateDto,
  ) {
    // TODO: check role = user
    const checkExist = await this.userService.checkExist(email, mobileNumber);
    switch (true) {
      case checkExist.email && checkExist.mobileNumber:
        throw new BadRequestException({
          statusCode: ENUM_USER_STATUS_CODE_ERROR.USER_EXISTS_ERROR,
          message: 'user.error.exist',
        });
      case checkExist.email:
        throw new BadRequestException({
          statusCode: ENUM_USER_STATUS_CODE_ERROR.USER_EMAIL_EXIST_ERROR,
          message: 'user.error.emailExist',
        });
      case checkExist.mobileNumber:
        throw new BadRequestException({
          statusCode:
            ENUM_USER_STATUS_CODE_ERROR.USER_MOBILE_NUMBER_EXIST_ERROR,
          message: 'user.error.mobileNumberExist',
        });
      default:
        break;
    }

    try {
      const password = await this.authService.createPassword(body.password);

      // NOTE: hash password
      // NOTE: create user
      // NOTE: create payload serial
      // NOTE: create access token
      // NOTE: create refresh token
      // NOTE: return
    } catch (err: any) {
      throw new InternalServerErrorException({
        statusCode: ENUM_ERROR_STATUS_CODE_ERROR.ERROR_UNKNOWN,
        message: 'http.serverError.internalServerError',
        error: err.message,
      });
    }
  }
}
