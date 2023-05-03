import { registerAs } from '@nestjs/config';
import ms from 'ms';
import { seconds } from 'src/common/helper/constants/helper.function.constant';

export default registerAs(
  'request',
  (): Record<string, any> => ({
    timeout: ms('30s'), // 30s based on ms module
    throttle: {
      ttl: seconds('500'), // 0.5 seconds
      limit: 10, // max request per reset time
    },
  }),
);
