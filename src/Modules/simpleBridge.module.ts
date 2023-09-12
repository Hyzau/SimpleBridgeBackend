import { Module } from '@nestjs/common';
import { SimpleBridgeController } from 'src/Controllers/simpleBridge.controller';
import { SimpleBridgeService } from 'src/Services/simpleBridge.service';

@Module({
  imports: [],
  controllers: [SimpleBridgeController],
  providers: [SimpleBridgeService],
})
export class SimpleBridgeModule {}
