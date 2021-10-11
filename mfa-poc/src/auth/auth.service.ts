import { Injectable } from '@nestjs/common';
import * as speakeasy from 'speakeasy';
import * as QRCode from 'qrcode';
import { write } from 'fs';

@Injectable()
export class AuthService {
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
    return await QRCode.toDataURL(otpauth_url);
  }

  validateSecret(token: string): any {
    const secret = this.getSecret();

    return speakeasy.totp.verify({
      secret: secret.base32,
      encoding: 'base32',
      token: token,
      window: 2,
    });
  }
}
