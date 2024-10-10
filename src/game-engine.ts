export class Mole {
    isVisible: boolean = false;
    appearTime: number = 0;
    canBeClicked: boolean = true;
    justWhacked: boolean = false;
  }
  
  export class GameEngine {
    moles: Mole[] = Array(9).fill(null).map(() => new Mole());
    score: number = 0;
    timeLeft: number = 15;
    gameOver: boolean = true;
    combo: number = 0;
    lastWhackTime: number = 0;
    private moleTimer: NodeJS.Timeout | null = null;
    private gameInterval: NodeJS.Timeout | null = null;
  
    startGame() {
      this.cleanup();
      this.score = 0;
      this.timeLeft = 15;
      this.gameOver = false;
      this.combo = 0;
      this.lastWhackTime = 0;
      this.moles.forEach(mole => {
        mole.isVisible = false;
        mole.appearTime = 0;
        mole.canBeClicked = true;
        mole.justWhacked = false;
      });
      this.startGameInterval();
      this.showRandomMole();
    }
  
    private startGameInterval() {
      this.gameInterval = setInterval(() => {
        if (!this.gameOver) {
          this.updateTime();
        }
      }, 1000);
    }
  
    showRandomMole() {
      if (this.gameOver) return;
  
      this.moles.forEach(mole => {
        mole.isVisible = false;
        mole.canBeClicked = true;
        mole.justWhacked = false;
      });
  
      const randomIndex = Math.floor(Math.random() * this.moles.length);
      const mole = this.moles[randomIndex];
      mole.isVisible = true;
      mole.appearTime = Date.now();
  
      if (this.moleTimer) {
        clearTimeout(this.moleTimer);
      }
  
      const duration = Math.random() * 200 + 200; // Random time between 200ms and 400ms
      this.moleTimer = setTimeout(() => {
        if (!this.gameOver) {
          mole.isVisible = false;
          this.showRandomMole();
        }
      }, duration);
    }
  
    whack(index: number): boolean {
      if (this.gameOver) return false;
  
      const mole = this.moles[index];
      if (mole.isVisible && mole.canBeClicked) {
        const whackTime = Date.now();
        const reactionTime = whackTime - mole.appearTime;
        
        if (reactionTime <= 400) {  // Strictly adhere to 400ms max
          if (whackTime - this.lastWhackTime <= 1000) {
            this.combo++;
          } else {
            this.combo = 1;
          }
          this.lastWhackTime = whackTime;
  
          this.score += this.combo;
  
          mole.canBeClicked = false;
          mole.justWhacked = true;
          mole.isVisible = false;
          return true;
        }
      }
      return false;
    }
  
    updateTime() {
      if (!this.gameOver) {
        this.timeLeft--;
        if (this.timeLeft <= 0) {
          this.endGame();
        }
      }
    }
  
    private endGame() {
      this.gameOver = true;
      this.cleanup();
    }
  
    cleanup() {
      if (this.moleTimer) {
        clearTimeout(this.moleTimer);
        this.moleTimer = null;
      }
      if (this.gameInterval) {
        clearInterval(this.gameInterval);
        this.gameInterval = null;
      }
    }
  }
  
  export function debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number
  ): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout | null = null;
    return (...args: Parameters<T>) => {
      if (timeout) {
        clearTimeout(timeout);
      }
      timeout = setTimeout(() => func(...args), wait);
    };
  }