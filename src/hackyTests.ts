import { BlankSlateGameState } from './BlankSlateGameState';

const state = new BlankSlateGameState(4);
console.log({
  points: [0, 0, 0, 0, 0, 0],
  guesses: ['', '', '', '', '', ''],
  playerCount: 4,
  winningScore: 10,
});
console.log(state.state);
let ser = state.serialize();
console.log(Number(ser[0].toString()).toString(2));

state.state.points = [1, 4, 9, 5, 0, 0];
ser = state.serialize();
console.log(Number(ser[0].toString()).toString(2));

state.state.guesses = [
  'spring',
  'spring',
  'bees',
  'animals',
  'flowers',
  'ultra long guess aaaa',
];
ser = state.serialize();
console.log(ser[1].toBits().map((b) => Number(b.toBoolean())));
console.log(ser[2].toBits().map((b) => Number(b.toBoolean())));
console.log(ser[3].toBits().map((b) => Number(b.toBoolean())));
console.log(
  ser[6]
    .toBits()
    .map((b) => Number(b.toBoolean()))
    .join('')
);

const state2 = new BlankSlateGameState(2);
console.log(state2.state);

process.exit();
