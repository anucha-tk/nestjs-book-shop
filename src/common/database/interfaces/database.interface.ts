import { PopulateOptions } from 'mongoose';
import { IPaginationOptions } from 'src/common/pagination/interfaces/pagination.interface';

export interface IDatabaseFindOneOptions<T = any>
  extends Pick<IPaginationOptions, 'order'> {
  select?: Record<string, boolean | number>;
  join?: boolean | PopulateOptions | PopulateOptions[];
  session?: T;
  withDeleted?: boolean;
}

export type IDatabaseSaveOptions<T = any> = Pick<
  IDatabaseFindOneOptions<T>,
  'session'
>;

export interface IDatabaseFindAllOptions<T = any>
  extends IPaginationOptions,
    Omit<IDatabaseFindOneOptions<T>, 'order'> {}

export type IDatabaseGetTotalOptions<T = any> = Pick<
  IDatabaseFindOneOptions<T>,
  'session' | 'withDeleted' | 'join'
>;
