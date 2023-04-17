import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { IAuthPassword } from 'src/common/auth/interfaces/auth.interface';
import { UserCreateDto } from 'src/modules/user/dtos/user.create.dto';
import { UserRepository } from 'src/modules/user/repository/repositories/user.repository';
import { UserService } from 'src/modules/user/services/user.service';

describe('User Module', () => {
  let userService: UserService;
  let userRepository: UserRepository;

  const userData: UserCreateDto = {
    username: faker.name.middleName(),
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    email: faker.internet.email(),
    mobileNumber: faker.phone.number(),
  };
  const password: IAuthPassword = {
    salt: faker.random.alphaNumeric(7),
    passwordHash: faker.random.alphaNumeric(10),
    passwordExpired: faker.date.future(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: UserRepository,
          useValue: {
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
    userRepository = module.get<UserRepository>(UserRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const expectUser = {
        ...userData,
        _id: '1',
        salt: password.salt,
        password: password.passwordHash,
        passwordExpired: password.passwordExpired,
        isActive: true,
        createdAt: faker.date.recent(),
        updatedAt: faker.date.recent(),
      };
      const spyUserRepoCreate = jest
        .spyOn(userRepository, 'create')
        .mockResolvedValue(expectUser);
      const result = await userService.create(userData, password);

      expect(spyUserRepoCreate).toHaveBeenCalledTimes(1);
      expect(userRepository.create).toHaveBeenCalledWith({
        ...userData,
        salt: password.salt,
        password: password.passwordHash,
        passwordExpired: password.passwordExpired,
        isActive: true,
      });
      expect(result).toEqual(expectUser);
    });
  });
});
