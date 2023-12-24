import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { HealthController } from './services/healthcheck/health.controller';
import { BalanceModule } from './services/balance/balance.module';
import { ProductModule } from './services/product/product.module';

@Module({
  imports: [TerminusModule, BalanceModule, ProductModule],
  controllers: [HealthController],
})
export class AppModule {}
