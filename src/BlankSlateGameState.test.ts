import { BlankSlateGameState } from './BlankSlateGameState';

describe('BlankSlateGamaeState.ts', () => {
  describe('constrructor()', () => {
    it('follows the happy path', () => {
      const state = new BlankSlateGameState(4);
      expect(state.state).toMatchObject({
        points: [0, 0, 0, 0, 0, 0],
        guesses: ['', '', '', '', '', ''],
        playerCount: 4,
        winningScore: 10,
      });
    });
  });
});
