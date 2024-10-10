import React, { useRef, useCallback, useEffect, useMemo, useState } from 'react';
import { GameEngine } from './game-engine';

const WhackAMole: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameEngineRef = useRef<GameEngine | null>(null);
  const [gameOver, setGameOver] = useState(false);

  const debounce = useMemo(() => {
    return <T extends (...args: any[]) => void>(func: T, delay: number): T => {
      let timeoutId: ReturnType<typeof setTimeout>;
      return function(this: any, ...args: any[]) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(this, args), delay);
      } as T;
    };
  }, []);

  useEffect(() => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        gameEngineRef.current = new GameEngine(ctx);
        gameEngineRef.current.start();

        const showMoleInterval = setInterval(() => {
          if (gameEngineRef.current && gameEngineRef.current.timeRemaining > 0) {
            gameEngineRef.current.showRandomMole();
          } else {
            clearInterval(showMoleInterval);
            setGameOver(true);
          }
        }, 1000);

        return () => {
          clearInterval(showMoleInterval);
        };
      }
    }
  }, []);

  const handleClick = useCallback((event: React.MouseEvent<HTMLCanvasElement>) => {
    if (canvasRef.current && gameEngineRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      gameEngineRef.current.handleClick(x, y);
    }
  }, []);

  const debouncedHandleClick = useMemo(() => debounce(handleClick, 200), [debounce, handleClick]);

  const resetGame = useCallback(() => {
    if (gameEngineRef.current) {
      gameEngineRef.current.reset();
      setGameOver(false);
    }
  }, []);

  return (
    <div>
      <canvas ref={canvasRef} width={300} height={300} onClick={debouncedHandleClick} />
      {gameOver && <div>Game Over! Your score: {gameEngineRef.current?.score}</div>}
      <button onClick={resetGame}>
        {gameOver ? 'Play Again' : 'Reset Game'}
      </button>
    </div>
  );
};

export default WhackAMole;