import { registerAs } from '@nestjs/config';

export default registerAs(
  'database',
  (): Record<string, any> => ({
    host: process.env.DB_HOST,
    name: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_USER_PWD,
  }),
);
