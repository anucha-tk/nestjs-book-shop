import { IAuthPassword } from 'src/common/auth/interfaces/auth.interface';
import { UserCreateDto } from '../dtos/user.create.dto';
import { UserDoc } from '../repository/entities/user.entity';

export interface IUserService {
  create(
    { firstName, lastName, email, mobileNumber, role }: UserCreateDto,
    { passwordExpired, passwordHash, salt }: IAuthPassword,
  ): Promise<UserDoc>;
}
