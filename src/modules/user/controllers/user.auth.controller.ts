import {
  BadRequestException,
  Body,
  Controller,
  ForbiddenException,
  Get,
  InternalServerErrorException,
  Patch,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  AuthJwtAccessProtected,
  AuthJwtPayload,
} from 'src/common/auth/decorators/auth.jwt.decorator';
import { IAuthPassword } from 'src/common/auth/interfaces/auth.interface';
import { AuthService } from 'src/common/auth/services/auth.service';
import { ENUM_ERROR_STATUS_CODE_ERROR } from 'src/common/error/constants/error.status-code.constant';
import { Response } from 'src/common/response/decorators/response.decorator';
import { IResponse } from 'src/common/response/interfaces/response.interface';
import { SettingService } from 'src/common/setting/services/setting.service';
import { ENUM_USER_STATUS_CODE_ERROR } from '../constants/user.status-code';
import { GetUser, UserProtected } from '../decorators/user.decorator';
import {
  UserAuthChangePasswordDoc,
  UserAuthInfoDoc,
  UserAuthProfileDoc,
} from '../docs/user.auth.doc';
import { UserChangePasswordDto } from '../dtos/user.change-password.dto';
import { IUserDoc } from '../interfaces/user.interface';
import { UserDoc } from '../repository/entities/user.entity';
import { UserInfoSerialization } from '../serializations/user.info.serialization';
import { UserProfileSerialization } from '../serializations/user.profile.serialization';
import { UserService } from '../services/user.service';

@ApiTags('modules.auth.user')
@Controller({
  version: '1',
  path: '/user',
})
@Controller()
export class UserAuthController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
    private readonly settingService: SettingService,
  ) {}

  @UserAuthInfoDoc()
  @Response('user.info', { serialization: UserInfoSerialization })
  @AuthJwtAccessProtected()
  @Get('/info')
  async info(
    @AuthJwtPayload() payload: UserInfoSerialization,
  ): Promise<IResponse> {
    return { data: payload };
  }

  @UserAuthProfileDoc()
  @Response('user.profile', {
    serialization: UserProfileSerialization,
  })
  @UserProtected()
  @AuthJwtAccessProtected()
  @Get('/profile')
  async profile(@GetUser() user: UserDoc): Promise<IResponse> {
    const userWithRole: IUserDoc = await this.userService.joinWithRole(user);
    return { data: userWithRole.toObject() };
  }

  @UserAuthChangePasswordDoc()
  @Response('user.changePassword')
  @UserProtected()
  @AuthJwtAccessProtected()
  @Patch('/change-password')
  async changePassword(
    @Body() body: UserChangePasswordDto,
    @GetUser() user: UserDoc,
  ): Promise<void> {
    const [passwordAttempt, maxPasswordAttempt] = await Promise.all([
      this.settingService.getPasswordAttempt(),
      this.settingService.getMaxPasswordAttempt(),
    ]);
    if (passwordAttempt && user.passwordAttempt >= maxPasswordAttempt) {
      throw new ForbiddenException({
        statusCode: ENUM_USER_STATUS_CODE_ERROR.USER_PASSWORD_ATTEMPT_MAX_ERROR,
        message: 'user.error.passwordAttemptMax',
      });
    }

    const matchPassword: boolean = await this.authService.validateUser(
      body.oldPassword,
      user.password,
    );
    if (!matchPassword) {
      try {
        await this.userService.increasePasswordAttempt(user);
      } catch (err: any) {
        throw new InternalServerErrorException({
          statusCode: ENUM_ERROR_STATUS_CODE_ERROR.ERROR_UNKNOWN,
          message: 'http.serverError.internalServerError',
          _error: err.message,
        });
      }

      throw new BadRequestException({
        statusCode: ENUM_USER_STATUS_CODE_ERROR.USER_PASSWORD_NOT_MATCH_ERROR,
        message: 'user.error.passwordNotMatch',
      });
    }

    const newMatchPassword: boolean = await this.authService.validateUser(
      body.newPassword,
      user.password,
    );
    if (newMatchPassword) {
      throw new BadRequestException({
        statusCode:
          ENUM_USER_STATUS_CODE_ERROR.USER_PASSWORD_NEW_MUST_DIFFERENCE_ERROR,
        message: 'user.error.newPasswordMustDifference',
      });
    }
    try {
      await this.userService.resetPasswordAttempt(user);
      const password: IAuthPassword = await this.authService.createPassword(
        body.newPassword,
      );
      await this.userService.updatePassword(user, password);
    } catch (err: any) {
      throw new InternalServerErrorException({
        statusCode: ENUM_ERROR_STATUS_CODE_ERROR.ERROR_UNKNOWN,
        message: 'http.serverError.internalServerError',
        _error: err.message,
      });
    }

    return;
  }
}
