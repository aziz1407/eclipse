import { NestFactory } from '@nestjs/core';
import { EclipseBatchModule } from './eclipse-batch.module';

async function bootstrap() {
  const app = await NestFactory.create(EclipseBatchModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
