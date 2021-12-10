import { BlankSlateGameState } from './BlankSlateGameState';
import { bToString } from './utils/bits';

// let bytes = bToString(113723913171059);
// console.log(bytes.map(x => String.fromCharCode(x)));

// bytes = bToString(105);
// console.log(bytes.map(x => String.fromCharCode(x)));

const state = new BlankSlateGameState(4);
state.state.guesses = [
  'spring',
  'spring',
  'bees',
  'ultra long guess aaaa',
  '',
  '',
];
let ser = state.serialize();
let bits1 = ser[1].toString();
let bits2 = ser[2].toString();
let bits3 = ser[3].toString();
let bits4 = ser[4].toString();

// console.log(bToString(Number(bits1)));
// console.log(bToString(Number(bits2)));
// console.log(bToString(Number(bits3)));
// console.log(bToString(Number(bits4)));

state.state.points = [1, 4, 9, 5, 0, 0];
ser = state.serialize();
console.log(
  ser[0]
    .toBits()
    .map((x) => Number(x.toBoolean()))
    .join('')
);

process.exit();
