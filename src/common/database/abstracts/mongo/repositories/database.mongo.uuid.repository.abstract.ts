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

  async create<N>(data: N): Promise<T> {
    const dataCreate: Record<string, any> = data;
    const create = await this._repository.create([dataCreate]);
    return create[0].toObject();
  }
}
