// local-auth.guard.ts
import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { createClient } from 'redis';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    
    const activate = (await super.canActivate(context)) as boolean;
    if (activate) {
      const request = context.switchToHttp().getRequest();
      await super.logIn(request);
    }
    return activate;
  }
}