export abstract class DatabaseBaseRepositoryAbstract<Entity> {
  abstract create<Dto = any>(data: Dto): Promise<Entity>;

  abstract exists(find: Record<string, any>): Promise<boolean>;

  abstract deleteMany(find: Record<string, any>): Promise<boolean>;

  abstract findOneById<T = Entity>(_id: string): Promise<T>;

  abstract findOne<T = Entity>(find: Record<string, any>): Promise<T>;

  abstract createMany<Dto>(data: Dto[]): Promise<boolean>;
}
