import { Injectable } from '@nestjs/common';
import { genSaltSync, hashSync } from 'bcryptjs';

@Injectable()
export class HelperHashService {
  randomSalt(length: number): string {
    return genSaltSync(length);
  }

  bcrypt(password: string, salt: string): string {
    return hashSync(password, salt);
  }
}
