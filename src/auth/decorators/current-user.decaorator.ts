import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  (_data: never, ctx: ExecutionContext): string => {
    const req = ctx.switchToHttp().getRequest();
    return req.currentUser;
  },
);
