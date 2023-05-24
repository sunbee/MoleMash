import { Component, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { ToastController } from '@ionic/angular';
import { ChangeDetectorRef } from '@angular/core';
import { Mole } from '../services/mole.model';
import { MoleService } from '../services/mole.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonicModule],
})

export class HomePage implements AfterViewInit {
  @ViewChild('canvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;
  private canvas!: HTMLCanvasElement;
  private context!: CanvasRenderingContext2D;
  private backgroundImage!: HTMLImageElement;
  private moles: Mole[] = [];
  private gameLoop: any;
  private gameOn: boolean = false;
  public score!: number;
  public selectedLevel: number = 1;
  private levels: any = [
    { moles: 3, interval: 2 },    // Level 1: 3 moles, new position every 2 seconds
    { moles: 5, interval: 1.5 },  // Level 2: 5 moles, new position every 1.5 seconds
    { moles: 15, interval: 1 }    // Level 3: 15 moles, new position every 1 second
  ];
  private scoreDebugElement!: HTMLElement;

  constructor(public moleService: MoleService, private toastController: ToastController, private cdr: ChangeDetectorRef) {}

  async presentScoreToast(debug_message: string) {
    const toast = await this.toastController.create({
      message: debug_message,
      duration: 2000, // Duration in milliseconds
      position: 'middle' // Position of the toast notification
    });
    toast.present();
  }

  ngAfterViewInit() {
    this.canvas = this.canvasRef.nativeElement;
    this.score = 0;

    if (this.canvas instanceof HTMLCanvasElement) {
      this.context = this.canvas.getContext('2d') as CanvasRenderingContext2D;
  
      if (this.context) {
        this.backgroundImage = new Image();
        this.backgroundImage.src = 'assets/mole_hole.png';
        this.backgroundImage.onload = () => {
          this.canvas.width = this.backgroundImage.width;
          this.canvas.height = this.backgroundImage.height;
          this.context.drawImage(this.backgroundImage, 0, 0);
        };
      } else {
        console.error('Failed to get 2D rendering context for canvas');
      }
    } else {
      console.error('Canvas element not found');
    }

    this.canvas.addEventListener('click', (event: MouseEvent) => {
      const canvasRect = this.canvas.getBoundingClientRect();
      const canvasLeft = canvasRect.left;
      const canvasTop = canvasRect.top;
      const canvasScaleX = this.canvas.width / canvasRect.width;
      const canvasScaleY = this.canvas.height / canvasRect.height;
      const mouseX = (event.clientX - canvasLeft) * canvasScaleX;
      const mouseY = (event.clientY - canvasTop) * canvasScaleY;

      this.moles.forEach((mole) => {
        if (!mole.isPaused && mole.isMouseOver(mouseX, mouseY)) {
          mole.isDisabled = true;
          mole.squeak();
          mole.pause();
          this.score++;
          this.updateScoreDisplayMessage()
          // this.presentScoreToast('Touche! ' + this.score);
        }
      })
    });

    this.canvas.addEventListener('touchstart', (event: TouchEvent) => {
      const touch = event.touches[0]
      // Get the position and size of the canvas element on the page
      const canvasRect = this.canvas.getBoundingClientRect();
      const canvasLeft = canvasRect.left;
      const canvasTop = canvasRect.top;
      const canvasScaleX = this.canvas.width / canvasRect.width;
      const canvasScaleY = this.canvas.height / canvasRect.height;
      const mouseX = (touch.clientX - canvasLeft) * canvasScaleX;
      const mouseY = (touch.clientY - canvasTop) * canvasScaleY;

      this.moles.forEach((mole) => {
        if (mole && mole.isTouchOver(mouseX, mouseY)) {
          mole.isDisabled = true;
          mole.squeak();
          mole.pause();
          this.score++;
          this.updateScoreDisplayMessage()
          // this.presentScoreToast('Touche! ' + this.score);
        }
      })
    });
  } 

  start_gameLoop() {
    if (this.gameLoop) {
      clearInterval(this.gameLoop)
    }

    this.gameLoop = setInterval(() => {
      // Clear the canvas
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

      // Draw the background
      this.context.drawImage(this.backgroundImage, 0, 0);

      // Update mole position and animate
      this.moles.forEach((mole) => {
        if (!mole.isDisabled) {
          mole.updatePosition(this.canvas.width, this.canvas.height);
          // Draw the mole
          mole.draw(this.context);
        }
      })      
    }, 1000 / this.levels[this.selectedLevel-1].interval); // Adjust the frame rate as desired (e.g., 12 frames per second)
  }

  startGame() {
    if (this.gameOn) {
      return;
    } else {
      this.moles = this.moleService.getMoles(this.levels[this.selectedLevel-1].moles);
      this.gameOn = true;
      this.score = 0;
      this.updateScoreDisplayMessage();
      // Start the game logic here
      this.start_gameLoop();
    }
  };

  stopGame() {
    this.gameOn = false;
    clearInterval(this.gameLoop);
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.score = 0;
    this.updateScoreDisplayMessage();
  }

  updateScoreDisplayMessage() {
    this.cdr.detectChanges()
    const scoreElement = document.getElementById('score-value');
    if (scoreElement) {
      scoreElement.textContent = this.score.toString();
    }
  }

  selectLevel(level: number) {
    this.selectedLevel = level;
  }
}  

