export class GameObject {
    constructor(public x: number, public y: number) {}
    update(deltaTime: number): void {}
    render(ctx: CanvasRenderingContext2D): void {}
  }
  
  export class Mole extends GameObject {
    isVisible: boolean = false;
    hideTimeout: number = 0;
  
    show(): void {
      this.isVisible = true;
      this.hideTimeout = window.setTimeout(() => this.hide(), Math.random() * 200 + 200);
    }
  
    hide(): void {
      this.isVisible = false;
      clearTimeout(this.hideTimeout);
    }
  
    render(ctx: CanvasRenderingContext2D): void {
      if (this.isVisible) {
        ctx.fillStyle = 'brown';
        ctx.beginPath();
        ctx.arc(this.x, this.y, 20, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }
  
  export class GameEngine {
    moles: Mole[] = [];
    score: number = 0;
    lastTime: number = 0;
    timeLimit: number = 60;
    timeRemaining: number = this.timeLimit;
  
    constructor(private ctx: CanvasRenderingContext2D) {
      for (let i = 0; i < 9; i++) {
        const x = (i % 3) * 100 + 50;
        const y = Math.floor(i / 3) * 100 + 50;
        this.moles.push(new Mole(x, y));
      }
    }
  
    update(currentTime: number): void {
      const deltaTime = currentTime - this.lastTime;
      this.lastTime = currentTime;
      this.timeRemaining -= deltaTime / 1000;
      if (this.timeRemaining <= 0) this.endGame();
    }
  
    render(): void {
      this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
      this.moles.forEach((mole, i) => {
        const x = (i % 3) * 100 + 50;
        const y = Math.floor(i / 3) * 100 + 50;
        this.ctx.fillStyle = 'black';
        this.ctx.beginPath();
        this.ctx.arc(x, y, 25, 0, Math.PI * 2);
        this.ctx.fill();
        mole.render(this.ctx);
      });
      this.ctx.fillStyle = 'black';
      this.ctx.font = '20px Arial';
      this.ctx.fillText(`Score: ${this.score}`, 10, 30);
      this.ctx.fillText(`Time: ${Math.ceil(this.timeRemaining)}s`, 10, 60);
    }
  
    start(): void {
      const gameLoop = (currentTime: number) => {
        this.update(currentTime);
        this.render();
        if (this.timeRemaining > 0) requestAnimationFrame(gameLoop);
      };
      requestAnimationFrame(gameLoop);
    }
  
    showRandomMole(): void {
      const hiddenMoles = this.moles.filter(mole => !mole.isVisible);
      if (hiddenMoles.length > 0) {
        const randomMole = hiddenMoles[Math.floor(Math.random() * hiddenMoles.length)];
        randomMole.show();
      }
    }
  
    handleClick(x: number, y: number): void {
      this.moles.forEach(mole => {
        const distance = Math.sqrt(Math.pow(x - mole.x, 2) + Math.pow(y - mole.y, 2));
        if (distance <= 20 && mole.isVisible) {
          mole.hide();
          this.score++;
        }
      });
    }
  
    endGame(): void {
      this.timeRemaining = 0;
      this.moles.forEach(mole => mole.hide());
    }
  
    reset(): void {
      this.score = 0;
      this.timeRemaining = this.timeLimit;
      this.moles.forEach(mole => mole.hide());
      this.start();
    }
  }