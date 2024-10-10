import React, { useState, useEffect, useCallback, useRef } from 'react';
import { GameEngine, debounce } from './game-engine';

const WhackAMole: React.FC = () => {
  const [gameEngine] = useState(() => new GameEngine());
  const [, forceUpdate] = useState({});
  const gameStarted = useRef(false);

  const handleWhack = useCallback((index: number) => {
    if (gameStarted.current && gameEngine.whack(index)) {
      forceUpdate({});
    }
  }, [gameEngine]);

  // Use a short debounce time to prevent accidental double-clicks
  const debouncedHandleWhack = useCallback(
    debounce(handleWhack, 100),
    [handleWhack]
  );

  useEffect(() => {
    const renderInterval = setInterval(() => {
      if (gameStarted.current && !gameEngine.gameOver) {
        forceUpdate({});
      }
    }, 50); // Update every 50ms for smoother rendering

    return () => {
      clearInterval(renderInterval);
      gameEngine.cleanup();
    };
  }, [gameEngine]);

  const startGame = useCallback(() => {
    gameEngine.startGame();
    gameStarted.current = true;
    forceUpdate({});
  }, [gameEngine]);

  return (
    <div className="game-container">
      <h1>Whack-a-Mole</h1>
      {gameStarted.current ? (
        <>
          <div className="game-info">Score: {gameEngine.score}</div>
          <div className="game-info">Time: {gameEngine.timeLeft}s</div>
          <div className="game-board">
            {gameEngine.moles.map((mole, index) => (
              <div 
                key={index} 
                className="mole-hole" 
                onClick={() => debouncedHandleWhack(index)}
              >
                <div className={`mole ${mole.isVisible ? 'visible' : ''}`}></div>
              </div>
            ))}
          </div>
          {gameEngine.gameOver && <div className="game-info">Game Over! Your score: {gameEngine.score}</div>}
          <button onClick={startGame}>{gameEngine.gameOver ? 'Play Again' : 'Reset Game'}</button>
        </>
      ) : (
        <button onClick={startGame}>Start Game</button>
      )}
    </div>
  );
};

export default WhackAMole;