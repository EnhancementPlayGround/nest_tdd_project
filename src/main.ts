import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';

async function bootstrap() {
  const phase = process.env.NODE_ENV || 'development';
  const envFileName = `.env.${phase}`;
  dotenv.config({ path: envFileName });

  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT || 3001;

  await app.listen(port);
}
bootstrap();
