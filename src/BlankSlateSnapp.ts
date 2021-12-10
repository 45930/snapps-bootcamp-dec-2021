import { BlankSlateGameState } from './BlankSlateGameState';

import {
  matrixProp,
  CircuitValue,
  Field,
  SmartContract,
  PublicKey,
  method,
  PrivateKey,
  Mina,
  Bool,
  state,
  State,
  isReady,
  Poseidon,
  UInt64,
  Party,
} from 'snarkyjs';

await isReady;

type RoundScoreRecord = {
  scores: Record<
    string,
    {
      players: Array<number>;
      value: number;
    }
  >;
};

class BlankSlateSnapp extends SmartContract {
  /* Contract State
    - serializedGameState | Field that can be deserialzed into a game state object, representing the current state of the game
  */
  @state(Field) serializedGameState: State<Field>;

  gameState: BlankSlateGameState;
  playerCount: number;

  constructor(address: PublicKey) {
    super(address);

    this.gameState = this.initialGameState();
    this.serializedGameState = State.init(this.gameState.serialize());
    this.playerCount = 4;
  }

  /*
   @dev initialize new game
  */
  initialGameState(): BlankSlateGameState {
    return new BlankSlateGameState();
  }

  /*
   @dev process a player's guess - if it is the last player in this round, then evaluate the round
   @param playerIndex functions as the player id in the game - the index in the scores array for the game state
   @param guess the player's guess for this round
  */
  submitGuess(playerIndex: number, guess: string) {
    // todo: add checks!
    this.gameState.state.guesses[playerIndex] = guess;
    this.updateGame();
    if (this.gameState.state.guesses.every((guess) => guess !== null)) {
      this.evaluateRound();
    }
  }

  /*
   @dev review the guesses, and apply score updates to the game state
  */
  evaluateRound() {
    // todo: add checks!
    const roundScores: RoundScoreRecord = {
      scores: {},
    };
    for (let i = 0; i < this.playerCount; i++) {
      const playerGuess = this.gameState.state.guesses[i];
      if (playerGuess === null) {
        throw Error;
      }
      if (playerGuess in roundScores.scores) {
        roundScores.scores[playerGuess].value += 1;
        roundScores.scores[playerGuess].players.push(i);
      } else {
        roundScores.scores[playerGuess] = {
          value: 0,
          players: [i],
        };
      }
    }
    for (const score in roundScores.scores) {
      if (roundScores.scores[score].value > 0) {
        roundScores.scores[score].players.forEach(
          (j) =>
            (this.gameState.state.points[j] += roundScores.scores[score].value)
        );
      }
    }
  }

  /*
   @dev write the current game state to the blockchain
  */
  updateGame() {
    // todo: add checks!
    this.serializedGameState.set(this.gameState.serialize());
  }
}

export default BlankSlateSnapp;
