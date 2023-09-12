import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { SimpleBridgeService } from 'src/Services/simpleBridge.service';
import { GameDataDto } from 'src/Classes/gameDataDto.class';

@Controller('/on-game-finished')
//@Controller()
export class SimpleBridgeController {
  constructor(private bridgeService: SimpleBridgeService) {}

  @Post()
  onGameFinished(@Body() post: GameDataDto): string {
    console.log("In OnGameFinished");
    var result: string = this.bridgeService.getGameWinner(post.gameString);
    console.log(result);
    return result;
  }
}
