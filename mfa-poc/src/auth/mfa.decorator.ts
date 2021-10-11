import { SetMetadata } from '@nestjs/common';

export enum MfaLevels {
  public,
  single,
  multiple,
}

export const Mfa = (level: MfaLevels) => SetMetadata('minimumLevel', level);
