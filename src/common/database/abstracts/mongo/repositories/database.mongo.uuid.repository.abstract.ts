import { Model, PopulateOptions, Document, ClientSession } from 'mongoose';
import { IDatabaseFindOneOptions } from 'src/common/database/interfaces/database.interface';
import { DatabaseBaseRepositoryAbstract } from '../../database.base-repository.abstract';

export abstract class DatabaseMongoUUIDRepositoryAbstract<
  Entity,
  EntityDocument,
> extends DatabaseBaseRepositoryAbstract<EntityDocument> {
  protected _repository: Model<Entity>;
  protected _joinOnFind?: PopulateOptions | PopulateOptions[];

  constructor(
    repository: Model<Entity>,
    options?: PopulateOptions | PopulateOptions[],
  ) {
    super();
    this._repository = repository;
    this._joinOnFind = options;
  }

  async create<Dto = any>(data: Dto): Promise<EntityDocument> {
    const dataCreate: Record<string, any> = data;
    const create = await this._repository.create([dataCreate]);
    return create[0] as EntityDocument;
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

  async findOneById<T = EntityDocument>(
    _id: string,
    options?: IDatabaseFindOneOptions<ClientSession>,
  ): Promise<T> {
    const findOne = this._repository.findById(_id);

    if (options?.join) {
      findOne.populate(
        typeof options.join === 'boolean'
          ? this._joinOnFind
          : (options.join as PopulateOptions | PopulateOptions[]),
      );
    }
    return findOne.exec() as any;
  }

  async findOne<T = EntityDocument>(find: Record<string, any>): Promise<T> {
    const findOne = this._repository.findOne<EntityDocument>(find);

    return findOne.exec() as any;
  }

  // bulk
  async createMany<Dto>(data: Dto[]): Promise<boolean> {
    const create = this._repository.insertMany(data, {});

    try {
      await create;
      return true;
    } catch (err: unknown) {
      throw err;
    }
  }

  async save(
    repository: EntityDocument & Document<string>,
  ): Promise<EntityDocument> {
    return repository.save();
  }
}
