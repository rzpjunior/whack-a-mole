import React, { useState, useEffect, useCallback } from 'react';

const WhackAMole: React.FC = () => {
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [moles, setMoles] = useState(Array(9).fill(false));
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);

  const showRandomMole = useCallback(() => {
    if (gameOver || !gameStarted) return;
    const randomIndex = Math.floor(Math.random() * moles.length);
    setMoles(prev => prev.map((mole, index) => index === randomIndex));
    setTimeout(() => setMoles(prev => prev.map(() => false)), Math.random() * 800 + 600);
  }, [gameOver, gameStarted, moles.length]);

  useEffect(() => {
    let moleInterval: number;
    let timerInterval: number;

    if (gameStarted && !gameOver) {
      moleInterval = window.setInterval(showRandomMole, 1000);
      timerInterval = window.setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(moleInterval);
            clearInterval(timerInterval);
            setGameOver(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      clearInterval(moleInterval);
      clearInterval(timerInterval);
    };
  }, [showRandomMole, gameStarted, gameOver]);

  const whackMole = (index: number) => {
    if (moles[index] && !gameOver && gameStarted) {
      setScore(prev => prev + 1);
      setMoles(prev => prev.map((mole, i) => i === index ? false : mole));
    }
  };

  const startGame = () => {
    setScore(0);
    setTimeLeft(60);
    setMoles(Array(9).fill(false));
    setGameOver(false);
    setGameStarted(true);
  };

  return (
    <div className="game-container">
      <h1>Whack-a-Mole</h1>
      {gameStarted ? (
        <>
          <div className="game-info">Score: {score}</div>
          <div className="game-info">Time: {timeLeft}s</div>
          <div className="game-board">
            {moles.map((mole, index) => (
              <div key={index} className="mole-hole" onClick={() => whackMole(index)}>
                <div className={`mole ${mole ? 'visible' : ''}`}></div>
              </div>
            ))}
          </div>
          {gameOver && <div className="game-info">Game Over! Your score: {score}</div>}
          <button onClick={startGame}>{gameOver ? 'Play Again' : 'Reset Game'}</button>
        </>
      ) : (
        <button onClick={startGame}>Start Game</button>
      )}
    </div>
  );
};

export default WhackAMole;