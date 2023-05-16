import { IDatabaseFindOneOptions } from '../interfaces/database.interface';

export abstract class DatabaseBaseRepositoryAbstract<Entity> {
  abstract create<Dto = any>(data: Dto): Promise<Entity>;

  abstract exists(find: Record<string, any>): Promise<boolean>;

  abstract deleteMany(find: Record<string, any>): Promise<boolean>;

  abstract findOneById<T = Entity>(
    _id: string,
    options?: IDatabaseFindOneOptions<any>,
  ): Promise<T>;

  abstract findOne<T = Entity>(find: Record<string, any>): Promise<T>;

  abstract createMany<Dto>(data: Dto[]): Promise<boolean>;

  abstract save(repository: Entity): Promise<Entity>;
}
