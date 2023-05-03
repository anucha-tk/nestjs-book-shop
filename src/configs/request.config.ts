import { registerAs } from '@nestjs/config';
import { seconds } from 'src/common/helper/constants/helper.function.constant';

export default registerAs(
  'request',
  (): Record<string, any> => ({
    throttle: {
      ttl: seconds('500'), // 0.5 seconds
      limit: 10, // max request per reset time
    },
  }),
);
