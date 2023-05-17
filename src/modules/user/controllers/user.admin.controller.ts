import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthJwtAdminAccessProtected } from 'src/common/auth/decorators/auth.jwt.decorator';
import {
  PaginationQuery,
  PaginationQueryFilterEqualObjectId,
  PaginationQueryFilterInBoolean,
} from 'src/common/pagination/decorators/pagination.decorator';
import { PaginationListDto } from 'src/common/pagination/dtos/pagination.list.dtos';
import { PaginationService } from 'src/common/pagination/services/pagination.service';
import {
  ENUM_POLICY_ACTION,
  ENUM_POLICY_SUBJECT,
} from 'src/common/policy/constants/policy.enum.constant';
import { PolicyAbilityProtected } from 'src/common/policy/decorators/policy.decorator';
import { ResponsePaging } from 'src/common/response/decorators/response.decorator';
import { IResponsePaging } from 'src/common/response/interfaces/response.interface';
import {
  USER_DEFAULT_AVAILABLE_ORDER_BY,
  USER_DEFAULT_AVAILABLE_SEARCH,
  USER_DEFAULT_BLOCKED,
  USER_DEFAULT_INACTIVE_PERMANENT,
  USER_DEFAULT_IS_ACTIVE,
  USER_DEFAULT_ORDER_BY,
  USER_DEFAULT_ORDER_DIRECTION,
  USER_DEFAULT_PER_PAGE,
} from '../constants/user.list.constant';
import { UserAdminListDoc } from '../docs/user.admin.doc';
import { IUserEntity } from '../interfaces/user.interface';
import { UserListSerialization } from '../serializations/user.list.serialization';
import { UserService } from '../services/user.service';

@ApiTags('modules.admin.user')
@Controller({
  version: '1',
  path: '/user',
})
export class UserAdminController {
  constructor(
    private readonly paginationService: PaginationService,
    private readonly userService: UserService,
  ) {}

  @UserAdminListDoc()
  @ResponsePaging('user.list', {
    serialization: UserListSerialization,
  })
  @PolicyAbilityProtected({
    subject: ENUM_POLICY_SUBJECT.USER,
    action: [ENUM_POLICY_ACTION.READ],
  })
  @AuthJwtAdminAccessProtected()
  @Get('/list')
  async list(
    @PaginationQuery(
      USER_DEFAULT_PER_PAGE,
      USER_DEFAULT_ORDER_BY,
      USER_DEFAULT_ORDER_DIRECTION,
      USER_DEFAULT_AVAILABLE_SEARCH,
      USER_DEFAULT_AVAILABLE_ORDER_BY,
    )
    { _search, _limit, _offset, _order }: PaginationListDto,
    @PaginationQueryFilterInBoolean('isActive', USER_DEFAULT_IS_ACTIVE)
    isActive: Record<string, any>,
    @PaginationQueryFilterInBoolean('blocked', USER_DEFAULT_BLOCKED)
    blocked: Record<string, any>,
    @PaginationQueryFilterInBoolean(
      'inactivePermanent',
      USER_DEFAULT_INACTIVE_PERMANENT,
    )
    inactivePermanent: Record<string, any>,
    @PaginationQueryFilterEqualObjectId('role')
    role: Record<string, any>,
  ): Promise<IResponsePaging> {
    const find: Record<string, any> = {
      ..._search,
      ...isActive,
      ...blocked,
      ...inactivePermanent,
      ...role,
    };

    const users: IUserEntity[] = await this.userService.findAll(find, {
      paging: {
        limit: _limit,
        offset: _offset,
      },
      order: _order,
    });

    const total: number = await this.userService.getTotal(find);
    const totalPage: number = this.paginationService.totalPage(total, _limit);

    return {
      _pagination: { total, totalPage },
      data: users,
    };
  }
}
