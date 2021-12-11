import { BlankSlateGameState } from './BlankSlateGameState';
import { Mina, isReady, PublicKey, PrivateKey, UInt64, Party } from 'snarkyjs';
import BlankSlateSnapp from './BlankSlateSnapp';

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

state.state.points = [1, 4, 9, 5, 0, 0];
ser = state.serialize();
// console.log(
//   ser[0]
//     .toBits()
//     .map((x) => Number(x.toBoolean()))
//     .join('')
// );

await isReady;
const mina = Mina.LocalBlockchain();
Mina.setActiveInstance(mina);
const account1 = mina.testAccounts[0].privateKey;
const account2 = mina.testAccounts[1].privateKey;

let snapp: BlankSlateSnapp;
let isDeploying = false;
let snappAddress: PublicKey;

isDeploying = true;
const snappPrivkey = PrivateKey.random();
snappAddress = snappPrivkey.toPublicKey();

let tx = await Mina.transaction(account1, async () => {
  const initialBalance = UInt64.fromNumber(1000000);
  const p = await Party.createSigned(account2);
  p.balance.subInPlace(initialBalance);
  snapp = await new BlankSlateSnapp(snappAddress, initialBalance, 4);
})
  .send()
  .wait();

await Mina.transaction(account2, async () => {
  await snapp.submitGuess(0, 'tree');
})
  .send()
  .wait();
await Mina.transaction(account2, async () => {
  await snapp.submitGuess(1, 'tree');
})
  .send()
  .wait();
await Mina.transaction(account2, async () => {
  await snapp.submitGuess(2, 'log');
})
  .send()
  .wait();
await Mina.transaction(account2, async () => {
  await snapp.submitGuess(3, 'stump');
})
  .send()
  .wait();
await Mina.transaction(account2, async () => {
  await snapp.evaluateRound();
})
  .send()
  .wait();

// await snapp.submitGuess(0, 'tree') // uncomment to fail - same player!
// await snapp.submitGuess(1, 'tree')
// await snapp.submitGuess(2, 'log')
// await snapp.submitGuess(3, 'stump')

// snapp.evaluateRound();

process.exit();
