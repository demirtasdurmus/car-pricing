import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { UserService } from '../modules/user/user.service';

@Injectable()
export class CurrentUserMiddleware implements NestMiddleware {
  constructor(private readonly userService: UserService) {}

  async use(req: Request, _res: Response, next: NextFunction) {
    const { user } = req.session || {};
    if (user) {
      const data = await this.userService.findOne(user.id);
      req.currentUser = data;
    }
    next();
  }
}
