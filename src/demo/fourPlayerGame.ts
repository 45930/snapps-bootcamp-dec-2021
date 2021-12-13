import { Mina, isReady, PublicKey, PrivateKey, UInt64, Party } from 'snarkyjs';
import BlankSlateSnapp from '../BlankSlateSnapp';

await isReady;
const mina = Mina.LocalBlockchain();
Mina.setActiveInstance(mina);
const account1 = mina.testAccounts[0].privateKey;
const account2 = mina.testAccounts[1].privateKey;

let snapp: BlankSlateSnapp;
let snappAddress: PublicKey;

const snappPrivkey = PrivateKey.random();
snappAddress = snappPrivkey.toPublicKey();

console.log('$$ Beggining new game with 4 players...');
await Mina.transaction(account1, async () => {
  const initialBalance = UInt64.fromNumber(1000000);
  const p = await Party.createSigned(account2);
  p.balance.subInPlace(initialBalance);
  snapp = await new BlankSlateSnapp(snappAddress, initialBalance, 4);
})
  .send()
  .wait();

console.log('$$ Round 1');
console.log("$$ Prompt is 'If you can't beat them, _____ them!");
console.log('$$ Players submitting guesses');
await Mina.transaction(account2, async () => {
  await snapp.submitGuess(0, 'join');
})
  .send()
  .wait();
await Mina.transaction(account2, async () => {
  await snapp.submitGuess(1, 'join');
})
  .send()
  .wait();
await Mina.transaction(account2, async () => {
  await snapp.submitGuess(2, 'destroy');
})
  .send()
  .wait();
await Mina.transaction(account2, async () => {
  await snapp.submitGuess(3, 'fight');
})
  .send()
  .wait();

// Including this transaction breaks the circuit because it
// updates the game state, but not the contract state because
// a second guess is not allowed. todo: rollback game state change in this case
// await Mina.transaction(account2, async () => {
//   await snapp.submitGuess(0, 'bingo');
// })
//   .send()
//   .wait();
await Mina.transaction(account2, async () => {
  await snapp.evaluateRound();
})
  .send()
  .wait();

console.log('$$ Round 2');
console.log("$$ Prompt is 'My favorite animal is a _____");
console.log('$$ Players submitting guesses');
await Mina.transaction(account2, async () => {
  await snapp.submitGuess(0, 'dog');
})
  .send()
  .wait();
await Mina.transaction(account2, async () => {
  await snapp.submitGuess(1, 'cat');
})
  .send()
  .wait();
await Mina.transaction(account2, async () => {
  await snapp.submitGuess(2, 'bear');
})
  .send()
  .wait();
await Mina.transaction(account2, async () => {
  await snapp.submitGuess(3, 'cat');
})
  .send()
  .wait();
await Mina.transaction(account2, async () => {
  await snapp.evaluateRound();
})
  .send()
  .wait();

console.log('$$ Round 3');
console.log("$$ Prompt is 'I'm just a ______ in paradise");
console.log('$$ Players submitting guesses');

await Mina.transaction(account2, async () => {
  await snapp.submitGuess(0, 'cheeseburger');
})
  .send()
  .wait();
await Mina.transaction(account2, async () => {
  await snapp.submitGuess(1, 'cheeseburger');
})
  .send()
  .wait();
await Mina.transaction(account2, async () => {
  await snapp.submitGuess(2, 'cheeseburger');
})
  .send()
  .wait();
await Mina.transaction(account2, async () => {
  await snapp.submitGuess(3, 'cheeseburger');
})
  .send()
  .wait();
await Mina.transaction(account2, async () => {
  await snapp.evaluateRound();
})
  .send()
  .wait();

await Mina.transaction(account2, async () => {
  const winner = await snapp.endGame();
  if (winner >= 0) {
    console.log(`Player ${winner + 1} wins!`);
  }
})
  .send()
  .wait();

process.exit();
