import { Field, isReady, Poseidon } from 'snarkyjs';
import { stringToBits, numberToBits } from './utils/bits';

type BlankSlateGameStateObject = {
  points: Array<number>;
  guesses: Array<string>;
  playerCount: number;
  winningScore: number;
};

await isReady;

export class BlankSlateGameState {
  MIN_PLAYERS = 3;
  MAX_PLAYERS = 6;

  public state: BlankSlateGameStateObject;

  constructor(playerCount: number) {
    console.assert(playerCount >= this.MIN_PLAYERS);
    console.assert(playerCount <= this.MAX_PLAYERS);

    this.state = {
      points: new Array(this.MAX_PLAYERS).fill(0),
      guesses: new Array(this.MAX_PLAYERS).fill(''),
      playerCount: playerCount,
      winningScore: 10,
    };
  }

  /*
   @dev will return an array of Field of length 1 + #players
        the first Field is the number or players + the scores for each, packed in
        each additional field is a player's guess - a guess can only be so long as to fit
        currently there is no handling of longer guesses
  */
  serialize(): Field[] {
    let fields = [];

    // Pack the current scores into one field
    let gameBits: Array<boolean> = [];
    gameBits = gameBits.concat(numberToBits(this.state.playerCount));
    for (let i = 0; i < this.state.playerCount; i++) {
      const score = this.state.points[i];
      gameBits = gameBits.concat(numberToBits(score));
    }

    fields.push(Field.ofBits(gameBits));

    // For each player, serialize their guess
    for (let i = 0; i < this.MAX_PLAYERS; i++) {
      const guess = this.state.guesses[i];
      const playerBits = stringToBits(guess);
      fields.push(Poseidon.hash([Field.ofBits(playerBits), new Field(1337)]));
    }
    return fields;
  }

  isOver(): boolean {
    return this.state.points
      .map((p) => p >= this.state.winningScore)
      .reduce((a, b) => a || b);
  }
}
