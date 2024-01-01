// balance.entity.ts

import { IsNotEmpty, IsString } from 'class-validator';

export class Balance {
  @IsString()
  @IsNotEmpty()
  userId: string;
  balance: number;
}
