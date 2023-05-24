export class Mole {
    private moleImage: HTMLImageElement;
    private moleWidth: number;
    private moleHeight: number;
    private x: number;
    private y: number;
    public isPaused: boolean;
    public isDisabled: boolean = false;
  
    constructor(moleImage: HTMLImageElement, moleWidth: number, moleHeight: number) {
      this.moleImage = moleImage;
      this.moleWidth = moleWidth;
      this.moleHeight = moleHeight;
      this.x = 0; // Initial X-coordinate of the mole's position on the canvas
      this.y = 0; // Initial Y-coordinate of the mole's position on the canvas
      this.isPaused = false;
    }
  
    public updatePosition(canvasWidth: number, canvasHeight: number) {
      this.x = Math.random() * (canvasWidth - this.moleWidth);
      this.y = Math.random() * (canvasHeight - this.moleHeight);
    }
  
    public draw(context: CanvasRenderingContext2D) {
      context.drawImage(
        this.moleImage,
        0,
        0,
        this.moleWidth,
        this.moleHeight,
        this.x,
        this.y,
        this.moleWidth,
        this.moleHeight
      );
    }
  
    public isMouseOver(x: number, y: number): boolean {
      return (
        x >= this.x &&
        x <= this.x + this.moleWidth &&
        y >= this.y &&
        y <= this.y + this.moleHeight
      );
    }
  
    public isTouchOver(x: number, y: number): boolean {
      return (
        x >= this.x &&
        x <= this.x + this.moleWidth &&
        y >= this.y &&
        y <= this.y + this.moleHeight
      );
    }
  
    public pause(duration: number = 1500) {
      this.isPaused = true;
      setTimeout(() => {
        this.resume();
      }, duration)
    }
  
    public resume() {
      this.isPaused = false;
    }
  
    public squeak() {
      const audio = new Audio('assets/moleSquashed.mp3');
      audio.play();  
    }
  }
  