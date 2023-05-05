import { registerAs } from '@nestjs/config';
import bytes from 'bytes';
import ms from 'ms';
import { seconds } from 'src/common/helper/constants/helper.function.constant';

export default registerAs(
  'request',
  (): Record<string, any> => ({
    // NOTE: make sure you disable body-parser on create nest-app
    body: {
      json: {
        maxFileSize: bytes('100kb'), // 100kb
      },
      raw: {
        maxFileSize: bytes('5.5mb'), // 5.5mb
      },
      text: {
        maxFileSize: bytes('100kb'), // 100kb
      },
      urlencoded: {
        maxFileSize: bytes('100kb'), // 100kb
      },
    },
    timeout: ms('30s'), // 30s based on ms module
    throttle: {
      ttl: seconds('500'), // 0.5 seconds
      limit: 10, // max request per reset time
    },
  }),
);
