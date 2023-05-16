import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AES, enc, mode, pad } from 'crypto-js';
import { IHelperEncryptionService } from '../interfaces/helper.encrypt-service.interface';
import { IHelperJwtOptions } from '../interfaces/helper.interface';

@Injectable()
export class HelperEncryptionService implements IHelperEncryptionService {
  constructor(private readonly jwtService: JwtService) {}

  aes256Encrypt(
    data: string | Record<string, any> | Record<string, any>[],
    key: string,
    iv: string,
  ): string {
    const cIv = enc.Utf8.parse(iv);
    const cipher = AES.encrypt(JSON.stringify(data), key, {
      mode: mode.CBC,
      padding: pad.Pkcs7,
      iv: cIv,
    });

    return cipher.toString();
  }

  aes256Decrypt(
    encrypted: string,
    key: string,
    iv: string,
  ): string | Record<string, any> | Record<string, any>[] {
    const cIv = enc.Utf8.parse(iv);
    const cipher = AES.decrypt(encrypted, key, {
      mode: mode.CBC,
      padding: pad.Pkcs7,
      iv: cIv,
    });

    return JSON.parse(cipher.toString(enc.Utf8));
  }

  jwtEncrypt(payload: Record<string, any>, options: IHelperJwtOptions): string {
    return this.jwtService.sign(payload, {
      secret: options.secretKey,
      expiresIn: options.expiredIn,
      notBefore: options.notBefore ?? 0,
      audience: options.audience,
      issuer: options.issuer,
      subject: options.subject,
    });
  }
}
