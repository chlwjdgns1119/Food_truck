// local-auth.guard.ts
import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    
    const can = await super.canActivate(context);
    if (can) {
      console.log("guard");
      const request = context.switchToHttp().getRequest();
      console.log(request.user);
      await super.logIn(request);
    }
    return true;
  }
}