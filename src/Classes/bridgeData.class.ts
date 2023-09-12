import { Card } from 'src/Classes/card.class';

export class BridgeData {
  teamAPoints: number = 0;
  teamBPoints: number = 0;
  trump: string = "";
  cards: Card[] = [];
  /*
  ** Player0 is North
  ** Player1 is East
  ** Player2 is South
  ** Player3 is West
  */
  players: string[] = [];
}
