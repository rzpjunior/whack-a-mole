import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { GameEngine, debounce } from './game-engine';

const WhackAMole: React.FC = () => {
  const [gameEngine] = useState(() => new GameEngine());
  const [, forceUpdate] = useState({});

  const handleWhack = useCallback((index: number) => {
    if (!gameEngine.gameOver && gameEngine.whack(index)) {
      forceUpdate({});
    }
  }, [gameEngine]);

  const debouncedHandleWhack = useMemo(() => 
    debounce(handleWhack, 50),
    [handleWhack]
  );

  useEffect(() => {
    const renderInterval = setInterval(() => {
      forceUpdate({});
    }, 16);

    return () => {
      clearInterval(renderInterval);
      gameEngine.cleanup();
    };
  }, [gameEngine]);

  const startGame = useCallback(() => {
    gameEngine.startGame();
    forceUpdate({});
  }, [gameEngine]);

  return (
    <div className="game-container">
      <h1>Whack-a-Mole</h1>
      <div className="game-info">Score: {gameEngine.score}</div>
      <div className="game-info">Time: {gameEngine.timeLeft}s</div>
      <div className="game-info">Combo: {gameEngine.combo}x</div>
      <div className="game-board">
        {gameEngine.moles.map((mole, index) => (
          <div 
            key={index} 
            className={`mole-hole ${mole.justWhacked ? 'whacked' : ''}`} 
            onClick={() => debouncedHandleWhack(index)}
          >
            <div className={`mole ${mole.isVisible ? 'visible' : ''}`}></div>
          </div>
        ))}
      </div>
      {gameEngine.gameOver && (
        <div className="game-info">
          {gameEngine.timeLeft === 15 ? "Click 'Start Game' to play!" : `Game Over! Final Score: ${gameEngine.score}`}
        </div>
      )}
      <button onClick={startGame}>
        {gameEngine.gameOver ? (gameEngine.timeLeft === 15 ? 'Start Game' : 'Play Again') : 'Reset Game'}
      </button>
    </div>
  );
};

export default WhackAMole;