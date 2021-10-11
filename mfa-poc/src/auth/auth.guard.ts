import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { MfaLevels } from './mfa.decorator';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const mfaLevel = this.reflector.get<MfaLevels>(
      'minimumLevel',
      context.getHandler(),
    );
    if (mfaLevel === MfaLevels.public) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    return true; //validateRequest(request);
  }
}
