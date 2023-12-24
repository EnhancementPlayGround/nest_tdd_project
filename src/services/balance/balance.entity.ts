// balance.entity.ts

import { IsNotEmpty, IsString } from 'class-validator';

export class UserBalance {
  @IsString()
  @IsNotEmpty()
  userId: string;
  balance: number;
}
