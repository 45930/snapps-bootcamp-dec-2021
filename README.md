# Mina Snapp: Blank Slate

This template uses TypeScript.

## About

This is a snarky js app built for the December 2021 snapps bootcamp run by Mina and O(1) labs. The app loosely follows the game [Blank Slate](https://boardgamegeek.com/boardgame/254188/blank-slate). The components could be mostly reused to play something like charades as well. The point is different players submit a guess in response to a prompt. You get points based on how many other players guessed the same thing. So using commit-reveal, we can prove after each round that each player did indeed guess what they claim to have guessed.

Reflection on the bootcamp can be found in notes.md

## How to build

```sh
npm run build
```

## How to run demo

Demos are just a hardcoded game played out. There are 2 games, you can run one or both!

```sh
npx tsc && node --experimental-specifier-resolution=node build/src/demo/fourPlayerGame.js

npx tsc && node --experimental-specifier-resolution=node build/src/demo/sixPlayerGame.js
```

## License

[Apache-2.0](LICENSE)
