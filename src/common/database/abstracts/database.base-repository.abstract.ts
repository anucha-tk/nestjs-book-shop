/**
 * An abstract base class that defines the interface for a generic database repository.
 *
 * @typeparam T The type of the entity stored in the database.
 */
export abstract class DatabaseBaseRepositoryAbstract<T> {
  /**
   * Creates a new entity in the database.
   *
   * @typeparam N The type of data used to create the entity.
   * @param data The data used to create the entity.
   * @returns A promise that resolves to the created entity.
   */
  abstract create<N>(data: N): Promise<T>;

  /**
   * Checks if at least one entity exists in the database that matches the specified criteria.
   *
   * @param find An object or array of objects containing the search criteria.
   * @returns A promise that resolves to `true` if at least one matching entity exists, otherwise `false`.
   */
  abstract exists(
    find: Record<string, any> | Record<string, any>[],
  ): Promise<boolean>;

  /**
   * Deletes multiple entities from the database that match the specified criteria.
   *
   * @param find An object or array of objects containing the search criteria.
   * @returns A promise that resolves to `true` if the delete operation was successful, otherwise `false`.
   */
  abstract deleteMany(
    find: Record<string, any> | Record<string, any>[],
  ): Promise<boolean>;

  /**
   * Retrieves a single entity from the database by its unique identifier.
   *
   * @param _id The unique identifier of the entity to retrieve.
   * @returns A promise that resolves to an entity of type Y if found, otherwise undefined.
   * @template Y The type of the entity to retrieve. Defaults to the same type as T.
   */
  abstract findOneById<Y = T>(_id: string): Promise<Y>;
}
