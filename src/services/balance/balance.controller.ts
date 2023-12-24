// balance.controller.ts

import { Controller, Post, Body, Param, Get } from '@nestjs/common';
import { BalanceService } from './balance.service';

@Controller('balance')
export class BalanceController {
  constructor(private readonly balanceService: BalanceService) {}

  @Post(':userId/charge')
  async chargeBalance(
    @Param('userId') userId: string,
    @Body() data: { amount: number },
  ) {
    const result = await this.balanceService.chargeBalance(userId, data.amount);
    return { success: result.success };
  }

  @Get(':userId')
  async getBalance(@Param('userId') userId: string) {
    const balance = await this.balanceService.getBalance(userId);
    return { balance };
  }
}
