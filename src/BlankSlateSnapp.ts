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

  constructor(address: PublicKey, initialBalance: UInt64, playerCount: number) {
    super(address);
    this.balance.addInPlace(initialBalance);

    this.playerCount = playerCount;
    this.gameState = this.initialGameState(playerCount);

    const initialGameState = this.gameState.serialize();
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
   @dev update game state
   @param playerIndex functions as the player id in the game - the index in the scores array for the game state
   @param guess the player's guess for this round
   @asserts current player[i] guess state is blank
   @updates player[i] state guess to $guess
  */
  async submitGuess(playerIndex: number, guess: string) {
    this.gameState.state.guesses[playerIndex] = guess;

    let playerGuess;
    switch (playerIndex) {
      case 0:
        playerGuess = await this.player1Guess.get();
        playerGuess.assertEquals(Poseidon.hash([Field(0), new Field('13370')]));
        const serialized = this.gameState.serialize()[playerIndex + 1];
        this.player1Guess.set(this.gameState.serialize()[playerIndex + 1]);
        console.log(`Set Player 1 guess to ${guess}`);
        console.log(`Serialized: ${serialized}`);
        break;
      case 1:
        playerGuess = await this.player2Guess.get();
        playerGuess.assertEquals(Poseidon.hash([Field(0), new Field('13371')]));
        const serialized2 = this.gameState.serialize()[playerIndex + 2];
        this.player2Guess.set(this.gameState.serialize()[playerIndex + 1]);
        console.log(`Set Player 2 guess to ${guess}`);
        console.log(`Serialized: ${serialized2}`);
        break;
      case 2:
        playerGuess = await this.player3Guess.get();
        playerGuess.assertEquals(Poseidon.hash([Field(0), new Field('13372')]));
        this.player3Guess.set(this.gameState.serialize()[playerIndex + 1]);
        console.log(`Set Player 3 guess to ${guess}`);
        break;
      case 3:
        playerGuess = await this.player4Guess.get();
        playerGuess.assertEquals(Poseidon.hash([Field(0), new Field('13373')]));
        this.player4Guess.set(this.gameState.serialize()[playerIndex + 1]);
        console.log(`Set Player 4 guess to ${guess}`);
        break;
      case 4:
        playerGuess = await this.player5Guess.get();
        playerGuess.assertEquals(Poseidon.hash([Field(0), new Field('13374')]));
        this.player5Guess.set(this.gameState.serialize()[playerIndex + 1]);
        console.log(`Set Player 5 guess to ${guess}`);
        break;
      case 5:
        playerGuess = await this.player6Guess.get();
        playerGuess.assertEquals(Poseidon.hash([Field(0), new Field('13375')]));
        this.player6Guess.set(this.gameState.serialize()[playerIndex + 1]);
        console.log(`Set Player 6 guess to ${guess}`);
        break;
      default:
        console.log(`Index out of bounds ${playerIndex}`);
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
    console.log(player1GuessAssertion);
    console.log(player1Guess.toString());
    console.log(this.gameState.serialize()[1]);
    // player1Guess.assertEquals(
    //   Poseidon.hash([
    //     Field.ofBits(stringToBits(player1GuessAssertion)),
    //     new Field('13370'),
    //   ])
    // );

    const player2GuessAssertion = this.gameState.state.guesses[0];
    const player2Guess = await this.player1Guess.get();
    console.log(player2GuessAssertion);
    console.log(player2Guess);
    console.log(this.gameState.serialize()[2]);
    player2Guess.assertEquals(
      Poseidon.hash([
        Field.ofBits(stringToBits(player2GuessAssertion)),
        new Field('13371'),
      ])
    );

    const player3GuessAssertion = this.gameState.state.guesses[0];
    const player3Guess = await this.player3Guess.get();
    player3Guess.assertEquals(
      Poseidon.hash([
        Field.ofBits(stringToBits(player3GuessAssertion)),
        new Field('13372'),
      ])
    );

    const player4GuessAssertion = this.gameState.state.guesses[0];
    const player4Guess = await this.player4Guess.get();
    player4Guess.assertEquals(
      Poseidon.hash([
        Field.ofBits(stringToBits(player4GuessAssertion)),
        new Field('13373'),
      ])
    );

    const player5GuessAssertion = this.gameState.state.guesses[0];
    const player5Guess = await this.player5Guess.get();
    player5Guess.assertEquals(
      Poseidon.hash([
        Field.ofBits(stringToBits(player5GuessAssertion)),
        new Field('13374'),
      ])
    );

    const player6GuessAssertion = this.gameState.state.guesses[0];
    const player6Guess = await this.player6Guess.get();
    player6Guess.assertEquals(
      Poseidon.hash([
        Field.ofBits(stringToBits(player6GuessAssertion)),
        new Field('13375'),
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
    this.serializedGameState.set(serialized[0]);
    this.player1Guess.set(serialized[1]);
    this.player2Guess.set(serialized[2]);
    this.player3Guess.set(serialized[3]);
    this.player4Guess.set(serialized[4]);
    this.player5Guess.set(serialized[5]);
    this.player6Guess.set(serialized[6]);
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
