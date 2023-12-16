// balance.service.spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import { BalanceService } from './balance.service';

describe('BalanceService', () => {
  let service: BalanceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BalanceService],
    }).compile();

    service = module.get<BalanceService>(BalanceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should charge balance for a user', async () => {
    const userId = 'user123';
    const amount = 10000;

    const result = await service.chargeBalance(userId, amount);

    expect(result).toEqual({ success: true });
  });

  it('should get user balance', async () => {
    const userId = 'user123';

    const result = await service.getBalance(userId);

    expect(result).toBeDefined();
  });
});
