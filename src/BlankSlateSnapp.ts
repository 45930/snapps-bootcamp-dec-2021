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
import { stringToBits, numberToBits } from './utils/bits';

// await isReady;

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
  @state(Field) player1Guess: State<Field>;
  @state(Field) player2Guess: State<Field>;
  @state(Field) player3Guess: State<Field>;
  @state(Field) player4Guess: State<Field>;
  @state(Field) player5Guess: State<Field>;
  @state(Field) player6Guess: State<Field>;

  gameState: BlankSlateGameState;
  playerCount: number;

  constructor(address: PublicKey, playerCount: number) {
    super(address);

    this.playerCount = 4;
    this.gameState = this.initialGameState(playerCount);

    const initialGameState = this.gameState.serialize();
    console.log(initialGameState[1].toString());
    this.serializedGameState = State.init(initialGameState[0]);
    this.player1Guess = State.init(initialGameState[1]);
    this.player2Guess = State.init(initialGameState[2]);
    this.player3Guess = State.init(initialGameState[3]);
    this.player4Guess = State.init(initialGameState[4]);
    this.player5Guess = State.init(initialGameState[5]);
    this.player6Guess = State.init(initialGameState[6]);
  }

  /*
   @dev initialize new game
   @param playerCount number of players in the game
  */
  initialGameState(playerCount: number): BlankSlateGameState {
    return new BlankSlateGameState(playerCount);
  }

  /*
   @dev process a player's guess - if it is the last player in this round, then evaluate the round
   @param playerIndex functions as the player id in the game - the index in the scores array for the game state
   @param guess the player's guess for this round
  */
  async submitGuess(playerIndex: number, guess: string) {
    console.log(`Submitting Guess: ${guess}`);
    let playerGuess;
    switch (playerIndex) {
      case 0:
        console.log('her0');
        console.log(this.gameState.serialize()[playerIndex + 1].toString());
        playerGuess = await this.player1Guess.get();
        console.log('her0');
        console.log(playerGuess.toString());
        playerGuess.assertEquals(new Field(0));
        await this.player1Guess.set(
          this.gameState.serialize()[playerIndex + 1]
        );
        break;
      case 1:
        console.log('her1');
        playerGuess = await this.player2Guess.get();
        console.log(playerGuess.toString());
        playerGuess.assertEquals(new Field(0));
        await this.player2Guess.set(
          this.gameState.serialize()[playerIndex + 1]
        );
        break;
      case 2:
        playerGuess = await this.player3Guess.get();
        playerGuess.assertEquals(new Field(0));
        await this.player3Guess.set(
          this.gameState.serialize()[playerIndex + 1]
        );
        break;
      case 3:
        playerGuess = await this.player4Guess.get();
        playerGuess.assertEquals(new Field(0));
        await this.player4Guess.set(
          this.gameState.serialize()[playerIndex + 1]
        );
        break;
      case 4:
        playerGuess = await this.player5Guess.get();
        playerGuess.assertEquals(new Field(0));
        await this.player5Guess.set(
          this.gameState.serialize()[playerIndex + 1]
        );
        break;
      case 5:
        playerGuess = await this.player6Guess.get();
        playerGuess.assertEquals(new Field(0));
        await this.player6Guess.set(
          this.gameState.serialize()[playerIndex + 1]
        );
        break;
      default:
        new Bool(false).assertEquals(new Bool(true));
    }
    this.gameState.state.guesses[playerIndex] = guess;
  }

  /*
   @dev review the guesses, and apply score updates to the game state
   @asserts player guess on chain == player guess being evaluated
   @asserts player scores on chain == player scores in state
   @updates player guesses reset to blank after evaluation
   @updates game scores get incremented by round scores
  */
  async evaluateRound() {
    const roundScores: RoundScoreRecord = {
      scores: {},
    };

    const player1GuessAssertion = this.gameState.state.guesses[0];
    const player1Guess = await this.player1Guess.get();
    player1Guess.assertEquals(
      Poseidon.hash([
        Field.ofBits(stringToBits(player1GuessAssertion)),
        new Field(1337),
      ])
    );

    const player2GuessAssertion = this.gameState.state.guesses[0];
    const player2Guess = await this.player1Guess.get();
    player2Guess.assertEquals(
      Poseidon.hash([
        Field.ofBits(stringToBits(player2GuessAssertion)),
        new Field(1337),
      ])
    );

    const player3GuessAssertion = this.gameState.state.guesses[0];
    const player3Guess = await this.player3Guess.get();
    player3Guess.assertEquals(
      Poseidon.hash([
        Field.ofBits(stringToBits(player3GuessAssertion)),
        new Field(1337),
      ])
    );

    const player4GuessAssertion = this.gameState.state.guesses[0];
    const player4Guess = await this.player4Guess.get();
    player4Guess.assertEquals(
      Poseidon.hash([
        Field.ofBits(stringToBits(player4GuessAssertion)),
        new Field(1337),
      ])
    );

    const player5GuessAssertion = this.gameState.state.guesses[0];
    const player5Guess = await this.player5Guess.get();
    player5Guess.assertEquals(
      Poseidon.hash([
        Field.ofBits(stringToBits(player5GuessAssertion)),
        new Field(1337),
      ])
    );

    const player6GuessAssertion = this.gameState.state.guesses[0];
    const player6Guess = await this.player6Guess.get();
    player6Guess.assertEquals(
      Poseidon.hash([
        Field.ofBits(stringToBits(player6GuessAssertion)),
        new Field(1337),
      ])
    );

    for (let i = 0; i < this.playerCount; i++) {
      const playerGuess = this.gameState.state.guesses[i];
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

    // Make sure score state is valid
    let gameBits: Array<boolean> = [];
    gameBits = gameBits.concat(numberToBits(this.gameState.state.playerCount));
    for (let i = 0; i < this.gameState.state.playerCount; i++) {
      const score = this.gameState.state.points[i];
      gameBits = gameBits.concat(numberToBits(score));
    }
    this.serializedGameState.assertEquals(Field.ofBits(gameBits));

    for (const score in roundScores.scores) {
      if (roundScores.scores[score].value > 0) {
        roundScores.scores[score].players.forEach(
          (j) =>
            (this.gameState.state.points[j] += roundScores.scores[score].value)
        );
      }
    }

    this.gameState.state.guesses = new Array(6).fill('');
    const serialized = this.gameState.serialize();

    // todo: add something like awaitAll here
    await this.serializedGameState.set(serialized[0]);
    await this.player1Guess.set(serialized[1]);
    await this.player2Guess.set(serialized[2]);
    await this.player3Guess.set(serialized[3]);
    await this.player4Guess.set(serialized[4]);
    await this.player5Guess.set(serialized[5]);
    await this.player6Guess.set(serialized[6]);
  }

  /*
   @dev write the current game state to the blockchain
  */
  updateGame() {
    // todo: add checks!
    // this.serializedGameState.set(this.gameState.serialize());
  }
}

export default BlankSlateSnapp;
