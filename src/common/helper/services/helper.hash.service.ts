import { Injectable } from '@nestjs/common';
import { genSaltSync, hashSync } from 'bcryptjs';
import { SHA256, enc } from 'crypto-js';

@Injectable()
export class HelperHashService {
  randomSalt(length: number): string {
    return genSaltSync(length);
  }

  bcrypt(password: string, salt: string): string {
    return hashSync(password, salt);
  }

  sha256(string: string): string {
    return SHA256(string).toString(enc.Hex);
  }

  sha256Compare(hashOne: string, hashTwo: string): boolean {
    return hashOne === hashTwo;
  }
}
