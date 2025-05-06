import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlashcardService, Flashcard } from '../../services/flashcard.service';
import { ConfettiComponent } from '../confetti/confetti.component';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-flashcard',
  standalone: true,
  imports: [CommonModule, ConfettiComponent],
  templateUrl: './flashcard.component.html',
  styleUrl: './flashcard.component.scss'
})
export class FlashcardComponent implements OnInit {
  currentCard: Flashcard | null = null;
  nextCard: Flashcard | null = null;
  isFlipped: boolean = false;
  score: number = 0;
  showConfetti: boolean = false;
  feedbackMessage: string = '';
  showFeedback: boolean = false;
  animateScore: boolean = false;
  isCardChanging: boolean = false;

  constructor(
    private flashcardService: FlashcardService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  private toPersianDigits(num: number): string {
    const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
    return String(num).replace(/[0-9]/g, (digit) => persianDigits[parseInt(digit)]);
  }

  get persianScore(): string {
    return this.toPersianDigits(this.score);
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const topic = params['topic'];
      const uniqueCode = params['uniqueCode'];
      
      if (uniqueCode) {
        // اگر کد منحصربه‌فرد در URL موجود باشد، فلش کارت با آن کد را نمایش دهیم
        this.findAndShowCardByUniqueCode(uniqueCode);
      } else if (topic) {
        // اگر فقط مبحث در URL موجود باشد، اولین فلش کارت آن مبحث را نمایش دهیم
        this.findAndShowCardByTopic(topic);
      } else {
        // اگر هیچ پارامتری در URL نباشد، کارت فعلی را نمایش دهیم
        this.loadCurrentCard();
        this.updateUrl();
      }
    });

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

  private findAndShowCardByUniqueCode(uniqueCode: string): void {
    const allCards = this.flashcardService.getFlashcards();
    const cardIndex = allCards.findIndex(card => card.uniqueCode === uniqueCode);
    
    if (cardIndex !== -1) {
      // پیدا کردن و نمایش کارت با کد منحصربه‌فرد
      this.flashcardService.setCurrentCardIndex(cardIndex);
      this.loadCurrentCard();
    } else {
      // اگر کارتی با این کد پیدا نشد، به مسیر اصلی ریدایرکت کنیم
      this.router.navigate(['/education/flashcards']);
    }
  }

  private findAndShowCardByTopic(topic: string): void {
    const allCards = this.flashcardService.getFlashcards();
    const cardIndex = allCards.findIndex(card => card.topic === topic);
    
    if (cardIndex !== -1) {
      // پیدا کردن و نمایش اولین کارت با مبحث مورد نظر
      this.flashcardService.setCurrentCardIndex(cardIndex);
      this.loadCurrentCard();
    } else {
      // اگر کارتی با این مبحث پیدا نشد، به مسیر اصلی ریدایرکت کنیم
      this.router.navigate(['/education/flashcards']);
    }
  }

  loadCurrentCard(): void {
    this.currentCard = this.flashcardService.getCurrentCard();
    this.showFeedback = false;
    this.isCardChanging = false;
    
    // به‌روزرسانی URL با مبحث و کد منحصربه‌فرد کارت فعلی
    this.updateUrl();
  }

  private updateUrl(): void {
    if (this.currentCard) {
      const topic = this.currentCard.topic;
      const uniqueCode = this.currentCard.uniqueCode;
      
      this.router.navigate(['/education/flashcards', topic, uniqueCode], { replaceUrl: true });
    }
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
    }, 650); // Delay slightly more than flip animation (0.6s)
  }

  goToNextCard(): void {
    this.showFeedback = false;
    this.isCardChanging = true;
    this.isFlipped = false;
    
    setTimeout(() => {
      this.flashcardService.nextCard();
      this.loadCurrentCard();
      // URL با مبحث و کد منحصربه‌فرد کارت جدید به‌روزرسانی می‌شود
    }, 650); // کمی بیشتر از مدت زمان انیمیشن چرخش (0.6s)
  }
}
