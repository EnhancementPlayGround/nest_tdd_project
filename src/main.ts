import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';

async function bootstrap() {
  const phase = process.env.NODE_ENV || 'dev';
  const envFileName = `.env.${phase}`;

  dotenv.config({ path: envFileName });

  const port = process.env.PORT || 3001;

  const app = await NestFactory.create(AppModule);

  await app.listen(port, () => {
    console.log(`Server is running on port ${port} in ${phase} mode`);
  });
}
bootstrap();
