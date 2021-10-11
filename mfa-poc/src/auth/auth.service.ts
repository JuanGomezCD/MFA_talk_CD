import { Injectable } from '@nestjs/common';
import * as speakeasy from 'speakeasy';
import * as QRCode from 'qrcode';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthService {
  logIn(user: string, pass: string): any {
    if (user === 'poc-user' && pass === 'poc-pass') {
      const jwtToken = jwt.sign(
        {
          user: user,
          auth: true,
          mfa: false,
        },
        'CloudDistrictRules',
      );

      return jwtToken;
    }

    return 'ERROR: Bad credentials';
  }

  getSecret(): any {
    /*const secret = speakeasy.generateSecret({
      name: 'MFA-poc-CD', // for authenticators visibility
    });*/

    const secret = {
      ascii: '^Am:abh6gbaInqwz4ST29A(x?w0bX9sV',
      hex: '5e416d3a61626836676261496e71777a34535432394128783f77306258397356',
      base32: 'LZAW2OTBMJUDMZ3CMFEW44LXPI2FGVBSHFASQ6B7O4YGEWBZONLA',
      otpauth_url:
        'otpauth://totp/MFA-poc-CD?secret=LZAW2OTBMJUDMZ3CMFEW44LXPI2FGVBSHFASQ6B7O4YGEWBZONLA',
    };

    return {
      otpauthUrl: secret.otpauth_url,
      base32: secret.base32,
    };
  }

  async respondWithQRCode(otpauth_url) {
    return QRCode.toDataURL(otpauth_url);
  }

  getMfaValidatedToken(token: string): string {
    const secret = this.getSecret();

    const verified = speakeasy.totp.verify({
      secret: secret.base32,
      encoding: 'base32',
      token: token,
      window: 2,
    });

    if (verified) {
      const jwtToken = jwt.sign(
        {
          user: 'user',
          auth: true,
          mfa: true,
        },
        'CloudDistrictRules',
      );

      return jwtToken;
    }

    return 'ERROR: Bad credentials';
  }
}
