import { getModelToken } from '@nestjs/mongoose';
import { Test } from '@nestjs/testing';
import { Model } from 'mongoose';
import { UserEntity } from 'src/modules/user/schemas/user.schema';
import { UserService } from 'src/modules/user/services/user.service';

describe('User Module', () => {
  let userService: UserService;
  let userModel: Model<UserEntity>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getModelToken(UserEntity.name),
          useValue: {
            new: jest.fn().mockResolvedValue({}),
            constructor: jest.fn().mockResolvedValue({}),
            find: jest.fn(),
            findById: jest.fn(),
            exists: jest.fn(),
            lean: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    userService = moduleRef.get<UserService>(UserService);
    userModel = moduleRef.get<Model<UserEntity>>(
      getModelToken(UserEntity.name),
    );
  });

  describe('checkExist', () => {
    it('should check if the email and mobile number exist', async () => {
      const email = 'test@example.com';
      const mobileNumber = '1234567890';
      const existEmail = true;
      const existMobileNumber = false;
      jest
        .spyOn(userModel, 'exists')
        .mockReturnValueOnce(Promise.resolve(existEmail) as never)
        .mockReturnValueOnce(Promise.resolve(existMobileNumber) as never);

      const result = await userService.checkExist(email, mobileNumber);

      expect(userModel.exists).toHaveBeenCalledTimes(2);
      expect(result).toEqual({
        email: existEmail,
        mobileNumber: existMobileNumber,
      });
    });
  });

  describe('findAll', () => {
    it('should find all users', async () => {
      const users = [
        { _id: '123', name: 'Test User', email: 'test@example.com' },
      ];
      jest.spyOn(userModel, 'find').mockReturnValueOnce({
        lean: jest.fn().mockResolvedValue(users),
      } as any);

      const result = await userService.findAll();

      expect(userModel.find).toHaveBeenCalled();
      expect(result).toEqual(users);
    });
  });
});
