import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  AuthJwtAccessProtected,
  AuthJwtPayload,
} from 'src/common/auth/decorators/auth.jwt.decorator';
import { Response } from 'src/common/response/decorators/response.decorator';
import { IResponse } from 'src/common/response/interfaces/response.interface';
import { UserAuthInfoDoc } from '../docs/user.auth.doc';
import { UserInfoSerialization } from '../serializations/user.info.serialization';

@ApiTags('modules.auth.user')
@Controller({
  version: '1',
  path: '/user',
})
@Controller()
export class UserAuthController {
  @UserAuthInfoDoc()
  @Response('user.info', { serialization: UserInfoSerialization })
  @AuthJwtAccessProtected()
  @Get('/info')
  async info(
    @AuthJwtPayload() payload: UserInfoSerialization,
  ): Promise<IResponse> {
    return { data: payload };
  }
}
