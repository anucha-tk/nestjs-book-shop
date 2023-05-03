import { Injectable, NestMiddleware } from '@nestjs/common';
import helmet from 'helmet';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class RequestHelmetMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction): void {
    helmet()(req, res, next);
  }
}
