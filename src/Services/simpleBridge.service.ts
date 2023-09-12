import { Injectable, Scope } from '@nestjs/common';
import { Card } from 'src/Classes/card.class';
import { BridgeData } from 'src/Classes/bridgeData.class';

@Injectable({ scope: Scope.REQUEST })
export class SimpleBridgeService {

  private readonly _suits: string[] = ['S', 'H', 'D', 'C'];
  private readonly _cards: string[] = ['2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A'];
  private _gameData: BridgeData = new BridgeData();


  getGameWinner(gameString: string): string {
    console.log("Service is called !");
    console.log(gameString);
    try {
      this.checkSyntax(gameString);
    }
    catch (e) {
      return e.toString();
    }
    
    
    this.calculateGamePoints();
    return this.getGameResultString();
  }

  calculateGamePoints(): void {
    var currentFirstPlayer: number = 0;
    var i: number = 0; 
    var currentTrickCards: Card[] = [];
    while (i < this._gameData.cards.length) {
      if (i % 4 == 0 && i != 0) {
        currentFirstPlayer = this.calculateCurrentTrickPoints(currentTrickCards, currentFirstPlayer);
        currentTrickCards = []; // reset the array
      }
      currentTrickCards[i % 4] = this._gameData.cards[i];
      i++;
    }
    if (i % 4 == 0) {
      this.calculateCurrentTrickPoints(currentTrickCards, currentFirstPlayer);
    }
  }

  calculateCurrentTrickPoints(currentTrickCards: Card[], currentFirstPlayer: number): number {
    if (currentTrickCards.length != 4)
      return 0; // invalidTrick
    var currentSuit: string = currentTrickCards[0].suit;
    var currentWinner: number = 0;
    var currentWinnerCardValue: number = 0;
    var firstTeamPoints: number = 0;
    var secondTeamPoints: number = 0;
    for (var i = 0; i < 4; i++) {
      var cardTrickValue = currentTrickCards[i].getValueForTrick(currentSuit, this._gameData.trump)
      if (cardTrickValue > currentWinnerCardValue) {
        currentWinner = i;
        currentWinnerCardValue = cardTrickValue;
      }
      // the first card played for each trick don't give any points !
      if (i == 2) {
        firstTeamPoints += currentTrickCards[i].getPointValue(currentSuit, this._gameData.trump)
      }
      else if (i != 0) {
        secondTeamPoints += currentTrickCards[i].getPointValue(currentSuit, this._gameData.trump)
      }
    }
    var winnerPoints = firstTeamPoints;
    if (currentWinner == 1 || currentWinner == 3) {
      winnerPoints = secondTeamPoints;
    } 
    var currentWinnerIndex : number = (currentFirstPlayer + currentWinner) % 4;
    // teamA wins trick
    if (currentWinnerIndex == 0 || currentWinnerIndex == 2) {
      this._gameData.teamAPoints += winnerPoints;
    }
    // teamB wins
    else {
      this._gameData.teamBPoints += winnerPoints;
    }
    //console.log("WinnerPoints = "+winnerPoints);
    return currentWinnerIndex;
  }

  getGameResultString(): string {
    var str: string = "equality";
    //console.log("TeamA = "+this._gameData.teamAPoints);
    //console.log("TeamB = "+this._gameData.teamBPoints);
    if (this._gameData.teamAPoints > this._gameData.teamBPoints) {
      str = this.formatResultString(this._gameData.teamAPoints, this._gameData.teamBPoints, 0, 1);
    }
    else if (this._gameData.teamAPoints < this._gameData.teamBPoints) {
      str = this.formatResultString(this._gameData.teamBPoints, this._gameData.teamAPoints, 1, 0);
    }
    return str;
  }

  formatResultString(a:number, b:number, w: number, l: number):string {
    return a + "-" + b + "#" + this._gameData.players[w] + "," + this._gameData.players[w + 2] + "#" + this._gameData.players[l] + "," + this._gameData.players[l + 2];
  }

  /*
  ** This function check a gameString syntax.
  ** If a problem is encountered, an error is thrown
  ** Therefore, checkSyntax should always be in a try catch.
  ** Also, for optimization purposes, checkSyntax fills this._gameData
  */
  checkSyntax(gameString: string): void {
    
    var stringArray = gameString.split("#");
    if (stringArray.length != 3) {
      throw new Error("Game string syntax Error. Game string must use the following syntax ${trump}#${state}#${players}");
    }
    var trump: string = stringArray[0];
    var state: string = stringArray[1];
    var players: string = stringArray[2];
    
    if (!this.checkTrumpSyntax(trump)) {
      throw new Error ("Trump syntax error.");
    }
    else if (!this.checkStateSyntax(state)) {
      throw new Error ("State syntax error.");
    }
    else if (!this.checkPlayersSyntax(players)) {
      throw new Error ("Players syntax error.");
    }
  }

  checkTrumpSyntax(trump: string): boolean {
    if (trump.length != 1)
      return false;
    if (!this._suits.includes(trump))
      return false;
    this._gameData.trump = trump;
    return true;
  }

  checkStateSyntax(state: string): boolean {
    var cardStrArray: string[] = state.split('-');
    if (cardStrArray.length < 4) {
      return false; // No valid trick, impossible to count points
    }
    var cardObjArray: Card[] = [];
    for (var i = 0; i < cardStrArray.length; i++) {
      if (cardStrArray[i].length != 2) {
        return false; // invalid card syntax
      }
      else if (!this._cards.includes(cardStrArray[i]['0'])) {
        return false; // card number is incorrect
      }
      else if (!this._suits.includes(cardStrArray[i]['1'])) {
        return false; // card suits is incorrect
      }
      var currentCard: Card = new Card(cardStrArray[i]['0'], 
        cardStrArray[i]['1'], 
        this._cards.indexOf(cardStrArray[i]['0']) + 1);
      cardObjArray.push(currentCard);
    }
    this._gameData.cards = cardObjArray;
    return true;
  }

  checkPlayersSyntax(players: string): boolean {
    var playersArray: string[] = players.split(',');
    if (playersArray.length != 4)
      return false; // incorrect number of players
    for (var i = 0; i < 4; i++) {
      if (playersArray[i].length < 1) // empty name
        return false;
    }
    this._gameData.players = playersArray;
    return true;
  }

  
}
