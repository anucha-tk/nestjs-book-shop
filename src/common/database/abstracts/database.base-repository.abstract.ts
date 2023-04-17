export abstract class DatabaseBaseRepositoryAbstract<T> {
  abstract create<N>(data: N): Promise<T>;
}
