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

  describe('chargeBalance', () => {
    it('should charge balance for a user', async () => {
      const userId = 'user123';
      const amount = 10000;

      const result = await service.chargeBalance(userId, amount);

      expect(result).toBeDefined();
      expect(result.success).toBe(true);
    });
  });

  describe('chargeBalance failure cases', () => {
    it('should return failure for an invalid user ID', async () => {
      const userId = '';
      const amount = 50;

      const result = await service.chargeBalance(userId, amount);

      expect(result.success).toBe(false);
    });

    it('should return failure for a negative charge amount', async () => {
      const userId = 'user123';
      const amount = -20;

      const result = await service.chargeBalance(userId, amount);
      expect(result.success).toBe(false);
    });

    it('should return failure for an invalid charge amount', async () => {
      const userId = 'user3';
      const amount = 0;

      const result = await service.chargeBalance(userId, amount);

      expect(result.success).toBe(false);
    });
  });

  describe('getBalance', () => {
    it('should get user balance', async () => {
      const userId = 'user123';

      const result = await service.getBalance(userId);

      expect(result).toBeDefined();
      expect(result).toBeGreaterThanOrEqual(0);
    });

    it('should return 0 for a non-existent user', async () => {
      const userId = 'nonExistentUser';

      const result = await service.getBalance(userId);

      expect(result).toBe(0);
    });
  });

  describe('getBalance failure cases', () => {
    it('should return 0 for an empty userId', async () => {
      const userId = '';

      const result = await service.getBalance(userId);

      expect(result).toBe(0);
    });

    it('should return 0 for a negative balance', async () => {
      const userId = 'userWithNegativeBalance';
      service['balances'].set(userId, -50); // setting negative balance

      const result = await service.getBalance(userId);

      expect(result).toBe(0);
    });
  });
});
