import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlashcardService, Flashcard } from '../../services/flashcard.service';
import { ConfettiComponent } from '../confetti/confetti.component';

@Component({
  selector: 'app-flashcard',
  standalone: true,
  imports: [CommonModule, ConfettiComponent],
  templateUrl: './flashcard.component.html',
  styleUrl: './flashcard.component.scss'
})
export class FlashcardComponent implements OnInit {
  currentCard: Flashcard | null = null;
  isFlipped: boolean = false;
  score: number = 0;
  showConfetti: boolean = false;
  feedbackMessage: string = '';
  showFeedback: boolean = false;
  animateScore: boolean = false;

  constructor(private flashcardService: FlashcardService) {}

  private toPersianDigits(num: number): string {
    const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
    return String(num).replace(/[0-9]/g, (digit) => persianDigits[parseInt(digit)]);
  }

  get persianScore(): string {
    return this.toPersianDigits(this.score);
  }

  ngOnInit(): void {
    this.loadCurrentCard();
    this.flashcardService.getScore().subscribe(newScore => {
      if (newScore > this.score) {
        this.animateScore = true;
        setTimeout(() => {
          this.animateScore = false;
        }, 400);
      }
      this.score = newScore;
    });
  }

  loadCurrentCard(): void {
    this.currentCard = this.flashcardService.getCurrentCard();
    this.isFlipped = false;
    this.showFeedback = false;
  }

  flipCard(): void {
    this.isFlipped = !this.isFlipped;
  }

  checkAnswer(isCorrect: boolean): void {
    console.log('checkAnswer called with:', isCorrect);
    const result = this.flashcardService.checkAnswer(isCorrect);
    console.log('Result from service:', result);
    
    this.flipCard();
    console.log('Card flipped. isFlipped:', this.isFlipped);
    
    setTimeout(() => {
      if (result) {
        this.feedbackMessage = 'آفرین! پاسخ شما صحیح بود.';
        this.showConfetti = true;
        console.log('Correct answer feedback set. Showing confetti.');
        setTimeout(() => {
          this.showConfetti = false;
        }, 3000);
      } else {
        this.feedbackMessage = 'متأسفانه پاسخ شما اشتباه بود.';
        console.log('Incorrect answer feedback set.');
      }
      this.showFeedback = true;
      console.log('showFeedback set to true.');
    }, 500); // زمان برای اتمام انیمیشن flip
  }

  nextCard(): void {
    this.flashcardService.nextCard();
    this.loadCurrentCard();
  }
}
