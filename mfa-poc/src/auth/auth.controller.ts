import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Mfa, MfaLevels } from './mfa.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('/qr-code')
  async getSecret(): Promise<string> {
    const secret = this.authService.getSecret();
    const imgSrc = await this.authService.respondWithQRCode(secret.otpauthUrl);

    return `<img src="${imgSrc}">`;
  }

  @Post('/login')
  @Mfa(MfaLevels.public)
  login(@Body('user') user: string, @Body('pass') pass: string): any {
    const jwtToken = this.authService.logIn(user, pass);

    return { token: jwtToken };
  }

  @Post('/mfa/authenticate')
  @Mfa(MfaLevels.single)
  validateSecret(@Body('token') token: string): any {
    const jwtToken = this.authService.getMfaValidatedToken(token);

    return { token: jwtToken };
  }
}
