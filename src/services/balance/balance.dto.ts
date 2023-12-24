// balance.dto.ts

import { IsNumber } from 'class-validator';

export class ChargeBalanceDto {
  @IsNumber()
  amount: number;
}
