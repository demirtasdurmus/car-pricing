import { CanActivate, ExecutionContext, UseGuards } from '@nestjs/common';
import { Observable } from 'rxjs';
import { EURole } from '../modules/user/user.entity';

export function Roles(...roles: EURole[]) {
  return UseGuards(new RoleGuard(roles));
}
export class RoleGuard implements CanActivate {
  constructor(private readonly roles: EURole[]) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const { session } = context.switchToHttp().getRequest() || {};

    if (!session.user) {
      return false;
    }

    return JSON.parse(session.user.roles).some((role: EURole) =>
      this.roles.includes(role),
    );
  }
}
