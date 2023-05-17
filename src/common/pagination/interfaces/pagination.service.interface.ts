import { IPaginationOrder } from './pagination.interface';

export interface IPaginationService {
  page(page?: number): number;
  offset(page: number, perPage: number): number;
  perPage(perPage?: number): number;
  order(
    orderByValue?: string,
    orderDirectionValue?: string,
    availableOrderBy?: string[],
  ): IPaginationOrder;
  search(
    searchValue?: string,
    availableSearch?: string[],
  ): Record<string, any> | undefined;
  totalPage(totalData: number, perPage: number): number;
  filterIn<T = string>(
    field: string,
    filterValue: T[],
  ): Record<string, { $in: T[] }>;
  filterEqual<T = string>(field: string, filterValue: T): Record<string, T>;
}
