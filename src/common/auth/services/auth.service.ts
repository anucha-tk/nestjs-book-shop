import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HelperDateService } from 'src/common/helper/services/helper.date.service';
import { HelperHashService } from 'src/common/helper/services/helper.hash.service';
import { IAuthPassword } from '../auth.interface';

@Injectable()
export class AuthService {
  constructor(
    private helperHashService: HelperHashService,
    private helperDateService: HelperDateService,
    private configService: ConfigService,
  ) {}

  async createPassword(password: string): Promise<IAuthPassword> {
    const saltLength = this.configService.get<number>(
      'auth.password.saltLength',
    );
    const salt = this.helperHashService.randomSalt(saltLength);

    const passwordExpiredInMs = this.configService.get<number>(
      'auth.password.expiredInMs',
    );
    const passwordExpired: Date =
      this.helperDateService.forwardInMilliseconds(passwordExpiredInMs);

    const passwordHash = this.helperHashService.bcrypt(password, salt);

    return {
      passwordHash,
      passwordExpired,
      salt,
    };
  }
}
