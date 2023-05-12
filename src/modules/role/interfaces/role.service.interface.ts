import { RoleCreateDto } from '../dtos/role.create.dto';

export interface IRoleService {
  deleteMany(find: Record<string, any>): Promise<boolean>;
  createMany(data: RoleCreateDto[]): Promise<boolean>;
}
