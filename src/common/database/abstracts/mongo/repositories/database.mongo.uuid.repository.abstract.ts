import { Model } from 'mongoose';
import { IDatabaseRepository } from 'src/common/database/interfaces/database.repository.interface';
import { DatabaseBaseRepositoryAbstract } from '../../database.base-repository.abstract';

export abstract class DatabaseMongoUUIDRepositoryAbstract<T>
  extends DatabaseBaseRepositoryAbstract<T>
  implements IDatabaseRepository<T>
{
  protected _repository: Model<T>;

  constructor(repository: Model<T>) {
    super();
    this._repository = repository;
  }

  /**
   * Creates a new instance of the entity in the database.
   *
   * @typeparam N The type of the data used to create the entity.
   * @param data The data used to create the entity.
   * @returns A promise that resolves to the created entity.
   */
  async create<N>(data: N): Promise<T> {
    const dataCreate: Record<string, any> = data;
    const create = await this._repository.create([dataCreate]);
    return create[0].toObject();
  }

  async exists(
    find: Record<string, any> | Record<string, any>[],
  ): Promise<boolean> {
    const exist = this._repository.exists({
      ...find,
      _id: {
        $nin: [],
      },
    });

    const result = await exist;
    return result ? true : false;
  }

  async deleteMany(
    find: Record<string, any> | Record<string, any>[],
  ): Promise<boolean> {
    const del = this._repository.deleteMany(find);
    try {
      await del;
      return true;
    } catch (err: unknown) {
      throw err;
    }
  }

  async findOneById<Y = T>(_id: string): Promise<Y> {
    const findOne = this._repository.findById(_id);

    return findOne.lean();
  }
}
