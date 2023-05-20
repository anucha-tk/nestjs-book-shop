import { faker } from '@faker-js/faker';
import { Injectable } from '@nestjs/common';
import { IHelperStringRandomOptions } from '../interfaces/helper.interface';
import { IHelperStringService } from '../interfaces/helper.string-service.interface';

@Injectable()
export class HelperStringService implements IHelperStringService {
  checkPasswordStrong(password: string, length?: number): boolean {
    const regex = new RegExp(
      `^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{${
        length ?? 8
      },}$`,
    );

    return regex.test(password);
  }

  random(length: number, options?: IHelperStringRandomOptions): string {
    const rString = options?.safe
      ? faker.internet.password(length, true, /[A-Z]/, options?.prefix)
      : faker.internet.password(length, false, /\w/, options?.prefix);

    return options?.upperCase ? rString.toUpperCase() : rString;
  }
}
