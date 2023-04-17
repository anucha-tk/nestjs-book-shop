export interface IDatabaseRepository<T> {
  // TODO: make optopns params
  create<N>(data: N): Promise<T>;
}
