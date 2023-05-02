export interface IDatabaseRepository<T> {
  // TODO: make options params
  create<N>(data: N): Promise<T>;

  exists(find: Record<string, any> | Record<string, any>[]): Promise<boolean>;

  deleteMany(
    find: Record<string, any> | Record<string, any>[],
  ): Promise<boolean>;

  findOneById<Y = T>(_id: string): Promise<Y>;
}
