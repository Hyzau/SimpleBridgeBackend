import { NestFactory } from '@nestjs/core';
import { SimpleBridgeModule } from 'src/Modules/simpleBridge.module';

async function bootstrap() {
  const app = await NestFactory.create(SimpleBridgeModule);
  await app.listen(3000);
}
bootstrap();