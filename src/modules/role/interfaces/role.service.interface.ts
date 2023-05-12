import { RoleCreateDto } from '../dtos/role.create.dto';
import { RoleDoc } from '../repository/entities/role.entity';

export interface IRoleService {
  deleteMany(find: Record<string, any>): Promise<boolean>;
  createMany(data: RoleCreateDto[]): Promise<boolean>;
}
