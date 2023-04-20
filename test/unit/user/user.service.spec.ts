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
            exists: jest.fn(),
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

  describe('exists by', () => {
    describe('username', () => {
      it('should return true when username exist', async () => {
        const spyUserRepoExists = jest
          .spyOn(userRepository, 'exists')
          .mockResolvedValue(true);
        const result = await userService.existByUsername('example');

        expect(result).toBeTruthy();
        expect(spyUserRepoExists).toHaveBeenCalledTimes(1);
        expect(spyUserRepoExists).toBeCalledWith({ username: 'example' });
      });

      it('should return false when username not exist', async () => {
        const spyUserRepoExists = jest
          .spyOn(userRepository, 'exists')
          .mockResolvedValue(false);
        const result = await userService.existByUsername('abc');

        expect(result).toBeFalsy();
        expect(spyUserRepoExists).toHaveBeenCalledTimes(1);
        expect(spyUserRepoExists).toBeCalledWith({ username: 'abc' });
      });
    });

    describe('email', () => {
      it('should return false when email not exist', async () => {
        const spyUserRepoExists = jest
          .spyOn(userRepository, 'exists')
          .mockResolvedValue(false);
        const result = await userService.existByEmail('abc@gmail.com');

        expect(result).toBeFalsy();
        expect(spyUserRepoExists).toHaveBeenCalledTimes(1);
        expect(spyUserRepoExists).toBeCalledWith({
          email: { $options: 'i', $regex: /abc@gmail.com/ },
        });
      });

      it('should return true when email not exist', async () => {
        const spyUserRepoExists = jest
          .spyOn(userRepository, 'exists')
          .mockResolvedValue(true);
        const result = await userService.existByEmail('x@gmail.com');

        expect(result).toBeTruthy();
        expect(spyUserRepoExists).toHaveBeenCalledTimes(1);
        expect(spyUserRepoExists).toBeCalledWith({
          email: { $options: 'i', $regex: /x@gmail.com/ },
        });
      });
    });

    describe('mobileNumber', () => {
      it('should return false when mobileNumber not exist', async () => {
        const spyUserRepoExists = jest
          .spyOn(userRepository, 'exists')
          .mockResolvedValue(false);
        const result = await userService.existByMobileNumber('123456789');

        expect(result).toBeFalsy();
        expect(spyUserRepoExists).toHaveBeenCalledTimes(1);
        expect(spyUserRepoExists).toBeCalledWith({ mobileNumber: '123456789' });
      });

      it('should return true when mobileNumber not exist', async () => {
        const spyUserRepoExists = jest
          .spyOn(userRepository, 'exists')
          .mockResolvedValue(true);
        const result = await userService.existByMobileNumber('123456789');

        expect(result).toBeTruthy();
        expect(spyUserRepoExists).toHaveBeenCalledTimes(1);
        expect(spyUserRepoExists).toBeCalledWith({ mobileNumber: '123456789' });
      });
    });
  });

  describe('deleteMany', () => {
    it('should return true when deleteMany', async () => {
      const find = { username: 'abc' };
      const spyUserRepoDeleteMany = jest
        .spyOn(userService, 'deleteMany')
        .mockResolvedValue(true);
      const result = await userService.deleteMany(find);
      expect(spyUserRepoDeleteMany).toHaveBeenCalledTimes(1);
      expect(spyUserRepoDeleteMany).toBeCalledWith(find);
      expect(result).toBeTruthy();
    });

    it('should return false when deleteMany', async () => {
      const find = { username: 'abc' };
      const spyUserRepoDeleteMany = jest
        .spyOn(userService, 'deleteMany')
        .mockResolvedValue(false);
      const result = await userService.deleteMany(find);
      expect(spyUserRepoDeleteMany).toHaveBeenCalledTimes(1);
      expect(spyUserRepoDeleteMany).toBeCalledWith(find);
      expect(result).toBeFalsy();
    });
  });
});
