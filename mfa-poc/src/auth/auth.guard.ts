import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { MfaLevels } from './mfa.decorator';
import * as jwt from 'jsonwebtoken';

interface RequestMfaLevel {
  auth: any;
  mfa: any;
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const EpMfaLevel = this.getMfaRequiredLevel(context);
    if (this.endPointIsPublic(EpMfaLevel)) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    if (!this.requestHasBearerToken(request)) {
      return false;
    }

    const requestMfaLevel = this.getMfaLevelFromRequestBearerToken(request);

    return this.validateMfaLevel(EpMfaLevel, requestMfaLevel);
  }

  private validateMfaLevel(
    EpMfaLevel: MfaLevels,
    requestMfaLevel: RequestMfaLevel,
  ): boolean {
    if (this.isMfaAuthenticated(EpMfaLevel, requestMfaLevel)) {
      return true;
    }

    if (this.isSingleAuthenticated(EpMfaLevel, requestMfaLevel)) {
      return true;
    }

    return false;
  }

  private isSingleAuthenticated(
    EpMfaLevel: MfaLevels,
    requestMfaLevel: RequestMfaLevel,
  ): boolean {
    return EpMfaLevel === MfaLevels.single && requestMfaLevel.auth;
  }

  private isMfaAuthenticated(
    EpMfaLevel: MfaLevels,
    requestMfaLevel: RequestMfaLevel,
  ): boolean {
    return EpMfaLevel === MfaLevels.multiple && requestMfaLevel.mfa;
  }

  private getMfaLevelFromRequestBearerToken(request): RequestMfaLevel {
    const jwtToken = request.headers.authorization.split(' ').pop();
    const decoded = jwt.verify(jwtToken, 'CloudDistrictRules');
    return {
      auth: decoded.auth,
      mfa: decoded.mfa,
    };
  }

  private requestHasBearerToken(request): boolean {
    return request.headers?.authorization == null;
  }

  private endPointIsPublic(mfaLevel: MfaLevels): boolean {
    return mfaLevel === MfaLevels.public;
  }

  private getMfaRequiredLevel(context: ExecutionContext): MfaLevels {
    return this.reflector.get<MfaLevels>('minimumLevel', context.getHandler());
  }
}
