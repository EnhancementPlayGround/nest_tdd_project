import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TerminusModule } from '@nestjs/terminus';
import { HealthController } from './controllers/health.controller';

@Module({
  imports: [TerminusModule],
  controllers: [HealthController, AppController],
  providers: [AppService],
})
export class AppModule {}
