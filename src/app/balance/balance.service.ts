// balance.service.ts

import { Injectable } from '@nestjs/common';

@Injectable()
export class BalanceService {
  private balances = new Map<string, number>();

  async chargeBalance(
    userId: string,
    amount: number,
  ): Promise<{ success: boolean }> {
    if (!this.balances.has(userId)) {
      this.balances.set(userId, 0);
    }

    this.balances.set(userId, this.balances.get(userId) + amount);

    return { success: true };
  }

  async getBalance(userId: string): Promise<number> {
    return this.balances.get(userId) || 0;
  }
}
