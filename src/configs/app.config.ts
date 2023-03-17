import { registerAs } from '@nestjs/config';

export default registerAs(
  'app',
  (): Record<string, any> => ({
    http: {
      port: Number.parseInt(process.env.APP_PORT) || 5000,
    },
  }),
);
