import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { IHelperJwtOptions } from '../helper.interface';

@Injectable()
export class HelperEncryptionService {
  constructor(private readonly jwtService: JwtService) {}

  jwtEncrypt(payload: Record<string, any>, options: IHelperJwtOptions): string {
    return this.jwtService.sign(payload, {
      secret: options.secretKey,
      expiresIn: options.expiredIn,
      notBefore: options.notBefore || 0,
    });
  }
}
