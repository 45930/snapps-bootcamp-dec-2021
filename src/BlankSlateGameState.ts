import { Field } from 'snarkyjs';

export type BlankSlateGameStateObject = {
  points: Array<number>;
  guesses: Array<string | null>;
  prompt?: string;
};

export class BlankSlateGameState {
  MAX_PLAYERS = 6;

  public state: BlankSlateGameStateObject;

  constructor() {
    this.state = {
      points: [0, 0, 0, 0],
      guesses: [null, null, null, null],
    };
  }

  serialize(): Field {
    return new Field(1);
  }
}
