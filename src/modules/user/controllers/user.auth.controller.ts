import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  AuthJwtAccessProtected,
  AuthJwtPayload,
} from 'src/common/auth/decorators/auth.jwt.decorator';
import { Response } from 'src/common/response/decorators/response.decorator';
import { IResponse } from 'src/common/response/interfaces/response.interface';
import { GetUser, UserProtected } from '../decorators/user.decorator';
import { UserAuthInfoDoc, UserAuthProfileDoc } from '../docs/user.auth.doc';
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
  constructor(private readonly userService: UserService) {}

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
}
