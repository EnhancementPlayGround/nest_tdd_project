import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { HealthController } from './services/healthcheck/health.controller';
import { BalanceModule } from './services/balance/balance.module';
import { ProductModule } from './services/product/product.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ormconfig } from './config/ormConfig';

@Module({
  imports: [
    TerminusModule,
    BalanceModule,
    ProductModule,
    TypeOrmModule.forRootAsync({
      useFactory: () => ormconfig[process.env.NODE_ENV || '$default'], // 환경에 맞는 설정 사용
    }),
  ],
  controllers: [HealthController],
})
export class AppModule {}
