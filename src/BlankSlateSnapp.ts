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
  Circuit,
} from 'snarkyjs';
import { stringToBits, numberToBits } from './utils/bits';

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

    const player1GuessAssertion = this.gameState.state.guesses[0];
    let player1Guess = await this.player1Guess.get();

    const player2GuessAssertion = this.gameState.state.guesses[1];
    let player2Guess = await this.player2Guess.get();

    const player3GuessAssertion = this.gameState.state.guesses[2];
    let player3Guess = await this.player3Guess.get();

    const player4GuessAssertion = this.gameState.state.guesses[3];
    let player4Guess = await this.player4Guess.get();

    const player5GuessAssertion = this.gameState.state.guesses[4];
    let player5Guess = await this.player5Guess.get();

    const player6GuessAssertion = this.gameState.state.guesses[5];
    let player6Guess = await this.player6Guess.get();

    // Circuit.if finds the correct player index to update
    // Second level if determines whether or not a guess has already been submitted
    // Only one player state may be updated, but at the end of the method all player state is attested
    player1Guess = Circuit.if(
      playerIndex == 0,
      Circuit.if(
        player1Guess.equals(Poseidon.hash([Field(0), new Field('13370')])),
        this.gameState.serialize()[playerIndex + 1],
        player1Guess
      ),
      player1Guess
    );

    player2Guess = Circuit.if(
      playerIndex == 1,
      Circuit.if(
        player2Guess.equals(Poseidon.hash([Field(0), new Field('13371')])),
        this.gameState.serialize()[playerIndex + 1],
        player2Guess
      ),
      player2Guess
    );

    player3Guess = Circuit.if(
      playerIndex == 2,
      Circuit.if(
        player3Guess.equals(Poseidon.hash([Field(0), new Field('13372')])),
        this.gameState.serialize()[playerIndex + 1],
        player3Guess
      ),
      player3Guess
    );

    player4Guess = Circuit.if(
      playerIndex == 3,
      Circuit.if(
        player4Guess.equals(Poseidon.hash([Field(0), new Field('13373')])),
        this.gameState.serialize()[playerIndex + 1],
        player4Guess
      ),
      player4Guess
    );

    player5Guess = Circuit.if(
      playerIndex == 4,
      Circuit.if(
        player5Guess.equals(Poseidon.hash([Field(0), new Field('13374')])),
        this.gameState.serialize()[playerIndex + 1],
        player5Guess
      ),
      player5Guess
    );

    player6Guess = Circuit.if(
      playerIndex == 5,
      Circuit.if(
        player6Guess.equals(Poseidon.hash([Field(0), new Field('13375')])),
        this.gameState.serialize()[playerIndex + 1],
        player6Guess
      ),
      player6Guess
    );

    console.log(`Player ${playerIndex + 1} guessed ${guess}`);

    this.player1Guess.set(player1Guess);
    this.player2Guess.set(player2Guess);
    this.player3Guess.set(player3Guess);
    this.player4Guess.set(player4Guess);
    this.player5Guess.set(player5Guess);
    this.player6Guess.set(player6Guess);
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

    // ensure that player guesses are legit
    const player1GuessAssertion = this.gameState.state.guesses[0];
    const player1Guess = await this.player1Guess.get();
    player1Guess.assertEquals(
      Poseidon.hash([
        Field.ofBits(stringToBits(player1GuessAssertion)),
        new Field('13370'),
      ])
    );

    const player2GuessAssertion = this.gameState.state.guesses[1];
    const player2Guess = await this.player2Guess.get();
    player2Guess.assertEquals(
      Poseidon.hash([
        Field.ofBits(stringToBits(player2GuessAssertion)),
        new Field('13371'),
      ])
    );

    const player3GuessAssertion = this.gameState.state.guesses[2];
    const player3Guess = await this.player3Guess.get();
    player3Guess.assertEquals(
      Poseidon.hash([
        Field.ofBits(stringToBits(player3GuessAssertion)),
        new Field('13372'),
      ])
    );

    const player4GuessAssertion = this.gameState.state.guesses[3];
    const player4Guess = await this.player4Guess.get();
    player4Guess.assertEquals(
      Poseidon.hash([
        Field.ofBits(stringToBits(player4GuessAssertion)),
        new Field('13373'),
      ])
    );

    const player5GuessAssertion = this.gameState.state.guesses[4];
    const player5Guess = await this.player5Guess.get();
    player5Guess.assertEquals(
      Poseidon.hash([
        Field.ofBits(stringToBits(player5GuessAssertion)),
        new Field('13374'),
      ])
    );

    const player6GuessAssertion = this.gameState.state.guesses[5];
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
    const blockChainGameState = await this.serializedGameState.get();
    blockChainGameState.assertEquals(this.gameState.serialize()[0]);

    for (const score in roundScores.scores) {
      if (roundScores.scores[score].value > 0) {
        roundScores.scores[score].players.forEach(
          (j) =>
            (this.gameState.state.points[j] += roundScores.scores[score].value)
        );
      }
    }

    console.log(`$$ Post-round scores: ${this.gameState.state.points}`);
    this.gameState.state.guesses = new Array(6).fill('');
    const serialized = this.gameState.serialize();

    this.serializedGameState.set(serialized[0]);
    this.player1Guess.set(serialized[1]);
    this.player2Guess.set(serialized[2]);
    this.player3Guess.set(serialized[3]);
    this.player4Guess.set(serialized[4]);
    this.player5Guess.set(serialized[5]);
    this.player6Guess.set(serialized[6]);
  }

  async submitPlayer1Guess(guess: string): Promise<Field> {
    let playerGuess;
    playerGuess = await this.player1Guess.get();
    playerGuess.assertEquals(Poseidon.hash([Field(0), new Field('13370')]));
    this.player1Guess.set(this.gameState.serialize()[1]);
    console.log(`Set Player 1 guess to ${guess}`);
    return playerGuess;
  }

  async submitPlayer2Guess(guess: string): Promise<Field> {
    let playerGuess;
    playerGuess = await this.player1Guess.get();
    playerGuess.assertEquals(Poseidon.hash([Field(0), new Field('13371')]));
    this.player1Guess.set(this.gameState.serialize()[2]);
    console.log(`Set Player 2 guess to ${guess}`);
    return playerGuess;
  }

  async submitPlayer3Guess(guess: string): Promise<Field> {
    let playerGuess;
    playerGuess = await this.player1Guess.get();
    playerGuess.assertEquals(Poseidon.hash([Field(0), new Field('13372')]));
    this.player1Guess.set(this.gameState.serialize()[3]);
    console.log(`Set Player 3 guess to ${guess}`);
    return playerGuess;
  }

  async submitPlayer4Guess(guess: string): Promise<Field> {
    let playerGuess;
    playerGuess = await this.player1Guess.get();
    playerGuess.assertEquals(Poseidon.hash([Field(0), new Field('13373')]));
    this.player1Guess.set(this.gameState.serialize()[4]);
    console.log(`Set Player 4 guess to ${guess}`);
    return playerGuess;
  }

  async submitPlayer5Guess(guess: string): Promise<Field> {
    let playerGuess;
    playerGuess = await this.player1Guess.get();
    playerGuess.assertEquals(Poseidon.hash([Field(0), new Field('13374')]));
    this.player1Guess.set(this.gameState.serialize()[5]);
    console.log(`Set Player 5 guess to ${guess}`);
    return playerGuess;
  }

  async submitPlayer6Guess(guess: string): Promise<Field> {
    let playerGuess;
    playerGuess = await this.player1Guess.get();
    playerGuess.assertEquals(Poseidon.hash([Field(0), new Field('13375')]));
    this.player1Guess.set(this.gameState.serialize()[6]);
    console.log(`Set Player 6 guess to ${guess}`);
    return playerGuess;
  }

  async endGame(): Promise<number> {
    console.log('Claim made that the game is over - validating state...');
    // Make sure score state is valid
    const blockChainGameState = await this.serializedGameState.get();
    let gameBits: Array<boolean> = [];
    gameBits = gameBits.concat(numberToBits(this.gameState.state.playerCount));
    for (let i = 0; i < this.gameState.state.playerCount; i++) {
      const score = this.gameState.state.points[i];
      gameBits = gameBits.concat(numberToBits(score));
    }
    gameBits = gameBits.concat(numberToBits(this.gameState.state.winningScore));
    Circuit.asProver(() => {
      blockChainGameState.assertEquals(Field.ofBits(gameBits));
    });

    const pointsArray = this.gameState.state.points;
    const maxPoints = Math.max.apply(null, pointsArray);
    if (this.gameState.isOver()) {
      console.log('Game is over!');
      return pointsArray.indexOf(maxPoints);
    } else {
      console.log(
        `Game is not over.  Current maximum score is ${maxPoints}, but winning score is ${this.gameState.state.winningScore}`
      );
      return -1;
    }
  }
}

export default BlankSlateSnapp;
