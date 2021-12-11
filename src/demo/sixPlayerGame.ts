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

console.log('$$ Beggining new game with 6 players...');
await Mina.transaction(account1, async () => {
  const initialBalance = UInt64.fromNumber(1000000);
  const p = await Party.createSigned(account2);
  p.balance.subInPlace(initialBalance);
  snapp = await new BlankSlateSnapp(snappAddress, initialBalance, 6);
})
  .send()
  .wait();

console.log('$$ Round 1');
console.log("$$ Prompt is 'My dream job is ____");
console.log('$$ Players submitting guesses');
await Mina.transaction(account2, async () => {
  await snapp.submitGuess(0, 'programmer');
})
  .send()
  .wait();
await Mina.transaction(account2, async () => {
  await snapp.submitGuess(1, 'brogrammer');
})
  .send()
  .wait();
await Mina.transaction(account2, async () => {
  await snapp.submitGuess(2, 'snapp dev!');
})
  .send()
  .wait();
await Mina.transaction(account2, async () => {
  await snapp.submitGuess(3, 'ethereum dev');
})
  .send()
  .wait();
await Mina.transaction(account2, async () => {
  await snapp.submitGuess(4, 'firefighter');
})
  .send()
  .wait();
await Mina.transaction(account2, async () => {
  await snapp.submitGuess(5, 'programmer');
})
  .send()
  .wait();
await Mina.transaction(account2, async () => {
  await snapp.evaluateRound();
})
  .send()
  .wait();

console.log('$$ Round 2');
console.log(
  "$$ Prompt is 'All I'm really thinking about is ______ and the fucking Mirage"
);
console.log('$$ Players submitting guesses');
await Mina.transaction(account2, async () => {
  await snapp.submitGuess(0, 'vegas');
})
  .send()
  .wait();
await Mina.transaction(account2, async () => {
  await snapp.submitGuess(1, 'peanuts');
})
  .send()
  .wait();
await Mina.transaction(account2, async () => {
  await snapp.submitGuess(2, 'vegas');
})
  .send()
  .wait();
await Mina.transaction(account2, async () => {
  await snapp.submitGuess(3, 'bananas');
})
  .send()
  .wait();
await Mina.transaction(account2, async () => {
  await snapp.submitGuess(4, 'vegas');
})
  .send()
  .wait();
await Mina.transaction(account2, async () => {
  await snapp.submitGuess(5, 'vegas');
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

console.log('$$ Round 3');
console.log("$$ Prompt is '_______ is the best Beatle");
console.log('$$ Players submitting guesses');
await Mina.transaction(account2, async () => {
  await snapp.submitGuess(0, 'john');
})
  .send()
  .wait();
await Mina.transaction(account2, async () => {
  await snapp.submitGuess(1, 'paul');
})
  .send()
  .wait();
await Mina.transaction(account2, async () => {
  await snapp.submitGuess(2, 'george');
})
  .send()
  .wait();
await Mina.transaction(account2, async () => {
  await snapp.submitGuess(3, 'ringo');
})
  .send()
  .wait();
await Mina.transaction(account2, async () => {
  await snapp.submitGuess(4, 'pete');
})
  .send()
  .wait();
await Mina.transaction(account2, async () => {
  await snapp.submitGuess(5, 'yoko');
})
  .send()
  .wait();
await Mina.transaction(account2, async () => {
  await snapp.evaluateRound();
})
  .send()
  .wait();

console.log('$$ Round 4');
console.log("$$ Prompt is 'The ______ and the Fury");
console.log('$$ Players submitting guesses');
await Mina.transaction(account2, async () => {
  await snapp.submitGuess(0, 'sound');
})
  .send()
  .wait();
await Mina.transaction(account2, async () => {
  await snapp.submitGuess(1, 'sound');
})
  .send()
  .wait();
await Mina.transaction(account2, async () => {
  await snapp.submitGuess(2, 'sound');
})
  .send()
  .wait();
await Mina.transaction(account2, async () => {
  await snapp.submitGuess(3, 'fast');
})
  .send()
  .wait();
await Mina.transaction(account2, async () => {
  await snapp.submitGuess(4, 'man');
})
  .send()
  .wait();
await Mina.transaction(account2, async () => {
  await snapp.submitGuess(5, '');
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
