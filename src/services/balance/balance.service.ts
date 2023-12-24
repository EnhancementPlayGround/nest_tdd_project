// balance.service.ts

import { Injectable } from '@nestjs/common';

@Injectable()
export class BalanceService {
  private balances = new Map<string, number>();

  async chargeBalance(
    userId: string,
    amount: number,
  ): Promise<{ success: boolean }> {
    if (!userId) return { success: false };
    if (amount <= 0) return { success: false };

    if (!this.balances.has(userId)) {
      this.balances.set(userId, amount);
    }

    this.balances.set(userId, this.balances.get(userId) + amount);

    return { success: true };
  }

  async deductBalance(userId: string, amount: number): Promise<boolean> {
    const balance = this.balances.get(userId);

    if (amount > balance) {
      return false; // 잔액 부족
    }

    this.balances.set(userId, balance - amount);
    return true;
  }

  async getBalance(userId: string): Promise<number> {
    const balance = this.balances.get(userId);
    if (balance >= 0) return balance;
    return 0;
  }
}
