import { registerAs } from '@nestjs/config';
import ms from 'ms';

export default registerAs(
  'auth',
  (): Record<string, any> => ({
    password: {
      saltLength: 8,
      expiredInMs: ms('182d'),
    },
  }),
);
