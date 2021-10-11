import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AuthService } from './auth/auth.service';

@Controller('auth')
export class AppController {
  constructor(private readonly authService: AuthService) {}

  @Get('/qr-code')
  async getSecret(): Promise<string> {
    const secret = this.authService.getSecret();
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const imgSrc = await this.authService.respondWithQRCode(secret.otpauthUrl);
    return `<img src="${imgSrc}">`;
  }

  @Post('/validate')
  validateSecret(@Body('token') token: string): any {
    const validated = this.authService.validateSecret(token);
    return { validated: validated };
  }
}
