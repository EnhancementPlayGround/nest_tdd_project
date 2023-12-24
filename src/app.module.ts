import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { HealthController } from './services/healthcheck/health.controller';
import { BalanceModule } from './services/balance/balance.module';

@Module({
  imports: [TerminusModule, BalanceModule],
  controllers: [HealthController],
  providers: [],
})
export class AppModule {}
