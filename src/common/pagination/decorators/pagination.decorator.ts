import { Query } from '@nestjs/common';
import { ENUM_PAGINATION_ORDER_DIRECTION_TYPE } from '../constants/pagination.enum.constant';
import { PaginationFilterInBooleanPipe } from '../pipes/pagination.filter-in-boolean.pipe';
import { PaginationFilterEqualObjectIdPipe } from '../pipes/pagination.filter.equal-object-id.pipe';
import { PaginationOrderPipe } from '../pipes/pagination.order.pipe';
import { PaginationPagingPipe } from '../pipes/pagination.paging.pipe';
import { PaginationSearchPipe } from '../pipes/pagination.search.pipe';

export function PaginationQuery(
  defaultPerPage: number,
  defaultOrderBy: string,
  defaultOrderDirection: ENUM_PAGINATION_ORDER_DIRECTION_TYPE,
  availableSearch: string[],
  availableOrderBy: string[],
): ParameterDecorator {
  return Query(
    PaginationSearchPipe(availableSearch),
    PaginationPagingPipe(defaultPerPage),
    PaginationOrderPipe(
      defaultOrderBy,
      defaultOrderDirection,
      availableOrderBy,
    ),
  );
}

export function PaginationQueryFilterInBoolean(
  field: string,
  defaultValue: boolean[],
  queryField?: string,
): ParameterDecorator {
  return Query(
    queryField ?? field,
    PaginationFilterInBooleanPipe(field, defaultValue),
  );
}

export function PaginationQueryFilterEqualObjectId(
  field: string,
  queryField?: string,
): ParameterDecorator {
  return Query(queryField ?? field, PaginationFilterEqualObjectIdPipe(field));
}
