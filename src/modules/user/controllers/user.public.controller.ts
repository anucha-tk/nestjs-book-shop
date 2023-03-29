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
import { UserSignupDto } from '../dto/user.sign-up.dto';
import { UserPayloadSerialization } from '../serializations/user.payload.serialization';
import { UserService } from '../services/user.service';
import { IUserDocument } from '../user.interface';

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
    { email, mobileNumber, ...body }: UserSignupDto,
  ) {
    //TODO: return type IResponse
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
      const { salt, passwordHash, passwordExpired } =
        await this.authService.createPassword(body.password);

      const createUser = await this.userService.create({
        firstName: body.firstName,
        lastName: body.lastName,
        email,
        password: passwordHash,
        passwordExpired,
        salt,
        mobileNumber,
      });
      const user = await this.userService.findOneById<IUserDocument>(
        createUser._id,
      );
      const payload: UserPayloadSerialization =
        await this.userService.payloadSerialization(user);
      const payloadAccessToken =
        await this.authService.createPayloadAccessToken(payload, false);

      const payloadRefreshToken =
        await this.authService.createPayloadRefreshToken(payload._id, false, {
          loginDate: payloadAccessToken.loginDate,
        });

      const accessToken = await this.authService.createAccessToken(
        payloadAccessToken,
      );
      const refreshToken = await this.authService.createRefreshToken(
        payloadRefreshToken,
        false,
      );

      return {
        accessToken,
        refreshToken,
      };
    } catch (err: any) {
      throw new InternalServerErrorException({
        statusCode: ENUM_ERROR_STATUS_CODE_ERROR.ERROR_UNKNOWN,
        message: 'http.serverError.internalServerError',
        error: err.message,
      });
    }
  }
}
