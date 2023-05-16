import { PopulateOptions } from 'mongoose';

export enum ENUM_PAGINATION_ORDER_DIRECTION_TYPE {
  ASC = 'asc',
  DESC = 'desc',
}

//TODO:  move to pagination module
export type IPaginationOrder = Record<
  string,
  ENUM_PAGINATION_ORDER_DIRECTION_TYPE
>;

export interface IPaginationPaging {
  limit: number;
  offset: number;
}

export interface IPaginationOptions {
  paging?: IPaginationPaging;
  order?: IPaginationOrder;
}

export interface IDatabaseFindOneOptions<T = any>
  extends Pick<IPaginationOptions, 'order'> {
  select?: Record<string, boolean | number>;
  join?: boolean | PopulateOptions | PopulateOptions[];
  session?: T;
  withDeleted?: boolean;
}
