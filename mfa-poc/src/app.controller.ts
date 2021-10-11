import { Controller, Get } from '@nestjs/common';
import { Mfa, MfaLevels } from './auth/mfa.decorator';

@Controller()
export class AppController {
  @Get()
  @Mfa(MfaLevels.multiple)
  getHello() {
    return 'Hello world!';
  }
}
