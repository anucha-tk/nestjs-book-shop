import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  ForbiddenException,
  HttpCode,
  HttpStatus,
  InternalServerErrorException,
  NotFoundException,
  Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ENUM_AUTH_LOGIN_WITH } from 'src/common/auth/constants/auth.enum.constant';
import { AuthService } from 'src/common/auth/services/auth.service';
import { ENUM_ERROR_STATUS_CODE_ERROR } from 'src/common/error/constants/error.status-code.constant';
import { Response } from 'src/common/response/decorators/response.decorator';
import { IResponse } from 'src/common/response/interfaces/response.interface';
import { SettingService } from 'src/common/setting/services/setting.service';
import { ENUM_ROLE_STATUS_CODE_ERROR } from 'src/modules/role/constants/role.status-code.constant';
import { RoleService } from 'src/modules/role/services/role.service';
import { ENUM_USER_SIGN_UP_FROM } from '../constants/user.enum.constant';
import {
  ENUM_USER_STATUS_CODE_ERROR,
  ENUM_USER_STATUS_CODE_SUCCESS,
} from '../constants/user.status-code';
import {
  UserPublicLoginDoc,
  UserPublicSignUpDoc,
} from '../docs/user.public.doc';
import { UserLoginDto } from '../dtos/user.login.dto';
import { UserSignUpDto } from '../dtos/user.sign-up.dto';
import { IUserDoc } from '../interfaces/user.interface';
import { UserDoc } from '../repository/entities/user.entity';
import { UserLoginSerialization } from '../serializations/user.login.serialization';
import { UserPayloadSerialization } from '../serializations/user.payload.serialization';
import { UserService } from '../services/user.service';

@ApiTags('modules.public.user')
@Controller({ version: '1', path: '/user' })
export class UserPublicController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
    private readonly roleService: RoleService,
    private readonly settingService: SettingService,
  ) {}

  @UserPublicLoginDoc()
  @Response('user.login', {
    serialization: UserLoginSerialization,
  })
  @HttpCode(HttpStatus.OK)
  @Post('/login')
  async login(@Body() { email, password }: UserLoginDto): Promise<IResponse> {
    const user: UserDoc = await this.userService.findOneByEmail(email);
    if (!user) {
      throw new NotFoundException({
        statusCode: ENUM_USER_STATUS_CODE_ERROR.USER_NOT_FOUND_ERROR,
        message: 'user.error.notFound',
      });
    }

    const passwordAttempt: boolean =
      await this.settingService.getPasswordAttempt();
    const maxPasswordAttempt: number =
      await this.settingService.getMaxPasswordAttempt();
    if (passwordAttempt && user.passwordAttempt >= maxPasswordAttempt) {
      throw new ForbiddenException({
        statusCode: ENUM_USER_STATUS_CODE_ERROR.USER_PASSWORD_ATTEMPT_MAX_ERROR,
        message: 'user.error.passwordAttemptMax',
      });
    }

    const validate: boolean = await this.authService.validateUser(
      password,
      user.password,
    );
    if (!validate) {
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
    } else if (user.blocked) {
      throw new ForbiddenException({
        statusCode: ENUM_USER_STATUS_CODE_ERROR.USER_BLOCKED_ERROR,
        message: 'user.error.blocked',
      });
    } else if (user.inactivePermanent) {
      throw new ForbiddenException({
        statusCode: ENUM_USER_STATUS_CODE_ERROR.USER_INACTIVE_PERMANENT_ERROR,
        message: 'user.error.inactivePermanent',
      });
    } else if (!user.isActive) {
      throw new ForbiddenException({
        statusCode: ENUM_USER_STATUS_CODE_ERROR.USER_INACTIVE_ERROR,
        message: 'user.error.inactive',
      });
    }

    const userWithRole: IUserDoc = await this.userService.joinWithRole(user);
    if (!userWithRole.role.isActive) {
      throw new ForbiddenException({
        statusCode: ENUM_ROLE_STATUS_CODE_ERROR.ROLE_INACTIVE_ERROR,
        message: 'role.error.inactive',
      });
    }

    try {
      await this.userService.resetPasswordAttempt(user);
    } catch (err: any) {
      throw new InternalServerErrorException({
        statusCode: ENUM_ERROR_STATUS_CODE_ERROR.ERROR_UNKNOWN,
        message: 'http.serverError.internalServerError',
        _error: err.message,
      });
    }

    const payload: UserPayloadSerialization =
      await this.userService.payloadSerialization(userWithRole);

    const tokenType: string = await this.authService.getTokenType();
    const expiresIn: number =
      await this.authService.getAccessTokenExpirationTime();
    const payloadAccessToken: Record<string, any> =
      await this.authService.createPayloadAccessToken(payload);
    const payloadRefreshToken: Record<string, any> =
      await this.authService.createPayloadRefreshToken(payload._id, {
        loginWith: ENUM_AUTH_LOGIN_WITH.LOCAL,
      });

    const payloadEncryption = await this.authService.getPayloadEncryption();

    let payloadHashedAccessToken: Record<string, any> | string =
      payloadAccessToken;
    let payloadHashedRefreshToken: Record<string, any> | string =
      payloadRefreshToken;

    if (payloadEncryption) {
      payloadHashedAccessToken = await this.authService.encryptAccessToken(
        payloadAccessToken,
      );
      payloadHashedRefreshToken = await this.authService.encryptRefreshToken(
        payloadRefreshToken,
      );
    }

    const accessToken: string = await this.authService.createAccessToken(
      payloadHashedAccessToken,
    );

    const refreshToken: string = await this.authService.createRefreshToken(
      payloadHashedRefreshToken,
    );

    const checkPasswordExpired: boolean =
      await this.authService.checkPasswordExpired(user.passwordExpired);

    if (checkPasswordExpired) {
      throw new ForbiddenException({
        statusCode: ENUM_USER_STATUS_CODE_SUCCESS.USER_PASSWORD_EXPIRED_ERROR,
        message: 'user.error.passwordExpired',
      });
    }

    return {
      data: {
        tokenType,
        expiresIn,
        accessToken,
        refreshToken,
      },
    };
  }

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
