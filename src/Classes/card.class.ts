export class Card {
  suit: string;
  pips: string;
  value: number;

  constructor(pips: string, suit: string, value: number) {
    this.suit = suit;
    this.pips = pips;
    this.value = value;
  }

  getValueForTrick(currentSuit: string, currentTrump: string): number {
    var val = this.value;
    // Card not of the current Suit are always loosing the trick
    if (currentSuit == this.suit)
      val += 14;
    // Trump are always winning a trick
    if (currentTrump == this.suit) 
      val =  val * 2 + 28;
    return val;
  }

  getPointValue(currentSuit: string, currentTrump: string): number {
    var val = this.value;
    if (currentTrump == this.suit)
      val *= 2
    else if (currentSuit != this.suit)
      val = 0;
    return val;
  }

}
