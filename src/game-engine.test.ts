import { GameEngine, Mole } from './game-engine';

describe('GameEngine', () => {
  let gameEngine: GameEngine;

  beforeEach(() => {
    gameEngine = new GameEngine();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('initializes with correct default values', () => {
    expect(gameEngine.score).toBe(0);
    expect(gameEngine.timeLeft).toBe(15);
    expect(gameEngine.gameOver).toBe(true);
    expect(gameEngine.combo).toBe(0);
    expect(gameEngine.moles.length).toBe(9);
    gameEngine.moles.forEach(mole => {
      expect(mole).toBeInstanceOf(Mole);
      expect(mole.isVisible).toBe(false);
    });
  });

  test('starts game correctly', () => {
    gameEngine.startGame();
    expect(gameEngine.score).toBe(0);
    expect(gameEngine.timeLeft).toBe(15);
    expect(gameEngine.gameOver).toBe(false);
    expect(gameEngine.combo).toBe(0);
  });

  test('shows random mole on game start', () => {
    gameEngine.startGame();
    jest.advanceTimersByTime(10);
    const visibleMoles = gameEngine.moles.filter(mole => mole.isVisible);
    expect(visibleMoles.length).toBe(1);
  });

  test('updates time correctly', () => {
    gameEngine.startGame();
    jest.advanceTimersByTime(1000);
    expect(gameEngine.timeLeft).toBe(14);
    jest.advanceTimersByTime(14000);
    expect(gameEngine.timeLeft).toBe(0);
    expect(gameEngine.gameOver).toBe(true);
  });

  test('whack increases score and combo for visible mole', () => {
    gameEngine.startGame();
    const visibleMoleIndex = gameEngine.moles.findIndex(mole => mole.isVisible);
    if (visibleMoleIndex !== -1) {
      expect(gameEngine.whack(visibleMoleIndex)).toBe(true);
      expect(gameEngine.score).toBe(1);
      expect(gameEngine.combo).toBe(1);
    }
  });

  test('whack does not increase score for invisible mole', () => {
    gameEngine.startGame();
    const invisibleMoleIndex = gameEngine.moles.findIndex(mole => !mole.isVisible);
    if (invisibleMoleIndex !== -1) {
      expect(gameEngine.whack(invisibleMoleIndex)).toBe(false);
      expect(gameEngine.score).toBe(0);
      expect(gameEngine.combo).toBe(0);
    }
  });

  test('combo increases with consecutive whacks', () => {
    gameEngine.startGame();
    for (let i = 0; i < 3; i++) {
      const visibleMoleIndex = gameEngine.moles.findIndex(mole => mole.isVisible);
      if (visibleMoleIndex !== -1) {
        gameEngine.whack(visibleMoleIndex);
        jest.advanceTimersByTime(500);
      }
    }
    expect(gameEngine.combo).toBe(3);
    expect(gameEngine.score).toBe(6);
  });

  test('combo resets after 1 second of inactivity', () => {
    gameEngine.startGame();
    const visibleMoleIndex = gameEngine.moles.findIndex(mole => mole.isVisible);
    if (visibleMoleIndex !== -1) {
      gameEngine.whack(visibleMoleIndex);
      expect(gameEngine.combo).toBe(1);
      jest.advanceTimersByTime(1100);
      const newVisibleMoleIndex = gameEngine.moles.findIndex(mole => mole.isVisible);
      if (newVisibleMoleIndex !== -1) {
        gameEngine.whack(newVisibleMoleIndex);
        expect(gameEngine.combo).toBe(1);
      }
    }
  });

  test('game ends when time runs out', () => {
    gameEngine.startGame();
    jest.advanceTimersByTime(15000);
    expect(gameEngine.gameOver).toBe(true);
    expect(gameEngine.timeLeft).toBe(0);
  });

});