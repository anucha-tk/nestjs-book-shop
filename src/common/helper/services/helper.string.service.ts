import { Injectable } from '@nestjs/common';
import { IHelperStringService } from '../interfaces/helper.string-serive.interface';

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
}
