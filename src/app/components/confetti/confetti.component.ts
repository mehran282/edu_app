import { Component, ElementRef, Inject, Input, OnChanges, OnDestroy, PLATFORM_ID, SimpleChanges, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-confetti',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './confetti.component.html',
  styleUrl: './confetti.component.scss'
})
export class ConfettiComponent implements OnChanges, OnDestroy, AfterViewInit {
  @Input() trigger: boolean = false;
  @ViewChild('canvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;

  private confettiAnimation: number | null = null;
  private ctx: CanvasRenderingContext2D | null = null;
  private confetti: Array<{
    x: number;
    y: number;
    size: number;
    color: string;
    speed: number;
    angle: number;
    rotation: number;
    rotationSpeed: number;
  }> = [];

  private colors: string[] = [
    '#f44336', '#e91e63', '#9c27b0', '#673ab7',
    '#3f51b5', '#2196f3', '#03a9f4', '#00bcd4',
    '#009688', '#4caf50', '#8bc34a', '#cddc39',
    '#ffeb3b', '#ffc107', '#ff9800', '#ff5722',
  ];

  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.isBrowser && changes['trigger'] && this.trigger) {
      this.startConfetti();
    }
  }

  ngAfterViewInit(): void {
    if (this.isBrowser) {
      const canvas = this.canvasRef.nativeElement;
      this.ctx = canvas.getContext('2d');
      if (!this.ctx) {
        console.error('Could not get 2D context for canvas.');
        return;
      }
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
  }

  startConfetti(): void {
    if (!this.isBrowser || !this.ctx) return;

    this.confetti = [];

    // Create confetti particles
    for (let i = 0; i < 150; i++) {
      this.confetti.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * -100,
        size: Math.random() * 10 + 5,
        color: this.colors[Math.floor(Math.random() * this.colors.length)],
        speed: Math.random() * 5 + 1,
        angle: Math.random() * Math.PI * 2,
        rotation: 0,
        rotationSpeed: Math.random() * 0.2 - 0.1,
      });
    }

    this.animateConfetti();
  }

  private animateConfetti(): void {
    if (!this.isBrowser || !this.ctx) return;

    this.ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    let stillFalling = false;

    for (const particle of this.confetti) {
      this.ctx.save();
      this.ctx.translate(particle.x, particle.y);
      this.ctx.rotate(particle.rotation);

      this.ctx.fillStyle = particle.color;
      this.ctx.fillRect(-particle.size / 2, -particle.size / 2, particle.size, particle.size);

      this.ctx.restore();

      // Update position
      particle.x += Math.cos(particle.angle) * 2;
      particle.y += particle.speed;
      particle.rotation += particle.rotationSpeed;

      // Check if particle is still on screen
      if (particle.y < window.innerHeight) {
        stillFalling = true;
      }
    }

    if (stillFalling) {
      this.confettiAnimation = requestAnimationFrame(() => this.animateConfetti());
    } else {
      this.stopConfetti();
    }
  }

  stopConfetti(): void {
    if (!this.isBrowser) return;

    if (this.confettiAnimation) {
      cancelAnimationFrame(this.confettiAnimation);
      this.confettiAnimation = null;
    }

    if (this.ctx) {
      this.ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    }
  }

  ngOnDestroy(): void {
    this.stopConfetti();
  }
}
