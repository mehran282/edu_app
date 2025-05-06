import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Flashcard {
  id: number;
  statement: string;
  explanation: string;
  correct: boolean;
  difficulty: 'آسان' | 'متوسط' | 'سخت';
  topic: string;
  uniqueCode: string;
}

@Injectable({
  providedIn: 'root'
})
export class FlashcardService {
  private flashcards: Flashcard[] = [
    {
      id: 1,
      statement: 'در بیشتر سلول‌های زنده، انرژی مورد نیاز از مولکول ATP تأمین می‌شود.',
      explanation: 'این گزاره صحیح است. ATP یا آدنوزین تری‌فسفات منبع اصلی انرژی در سلول‌های زنده است که انرژی شیمیایی را برای واکنش‌های درون سلولی فراهم می‌کند.',
      correct: true,
      difficulty: 'آسان',
      topic: 'متابولیسم سلولی',
      uniqueCode: 'A7X9F2D5'
    },
    {
      id: 2,
      statement: 'میتوکندری فقط در سلول‌های جانوری یافت می‌شود.',
      explanation: 'این گزاره نادرست است. میتوکندری هم در سلول‌های جانوری و هم در سلول‌های گیاهی یافت می‌شود و نقش مهمی در تنفس سلولی و تولید ATP دارد.',
      correct: false,
      difficulty: 'متوسط',
      topic: 'اندامک‌های سلولی',
      uniqueCode: 'B3K7L8P2'
    },
    {
      id: 3,
      statement: 'زنجیره انتقال الکترون در غشای درونی میتوکندری قرار دارد.',
      explanation: 'این گزاره صحیح است. زنجیره انتقال الکترون که در فرآیند تنفس سلولی نقش دارد، در غشای درونی میتوکندری واقع شده است.',
      correct: true,
      difficulty: 'متوسط',
      topic: 'تنفس سلولی',
      uniqueCode: 'C5R2M9V4'
    },
    {
      id: 4,
      statement: 'دیواره سلولی در سلول‌های گیاهی از جنس کیتین است.',
      explanation: 'این گزاره نادرست است. دیواره سلولی در گیاهان عمدتاً از جنس سلولز است، نه کیتین. کیتین در اسکلت خارجی حشرات و دیواره سلولی قارچ‌ها یافت می‌شود.',
      correct: false,
      difficulty: 'سخت',
      topic: 'ساختار سلول گیاهی',
      uniqueCode: 'D8E3N7S1'
    },
    {
      id: 5,
      statement: 'در تخمیر لاکتیکی، پیرووات به لاکتات تبدیل می‌شود.',
      explanation: 'این گزاره صحیح است. در فرآیند تخمیر لاکتیکی که در شرایط بی‌هوازی رخ می‌دهد، پیرووات به لاکتات تبدیل می‌شود و NAD+ بازسازی می‌شود.',
      correct: true,
      difficulty: 'آسان',
      topic: 'تخمیر و متابولیسم',
      uniqueCode: 'E6W1Z4G8'
    }
  ];

  private currentCardIndex = new BehaviorSubject<number>(0);
  private score = new BehaviorSubject<number>(0);

  constructor() { }

  getFlashcards(): Flashcard[] {
    return this.flashcards;
  }

  getCurrentCardIndex(): Observable<number> {
    return this.currentCardIndex.asObservable();
  }

  setCurrentCardIndex(index: number): void {
    if (index >= 0 && index < this.flashcards.length) {
      this.currentCardIndex.next(index);
    }
  }

  getCurrentCard(): Flashcard {
    return this.flashcards[this.currentCardIndex.value];
  }

  nextCard(): void {
    const nextIndex = (this.currentCardIndex.value + 1) % this.flashcards.length;
    this.currentCardIndex.next(nextIndex);
  }

  checkAnswer(isCorrect: boolean): boolean {
    const currentCard = this.getCurrentCard();
    const isAnswerCorrect = (currentCard.correct === isCorrect);
    
    if (isAnswerCorrect) {
      if (currentCard.difficulty === 'سخت') {
        this.addScore(2);
      } else {
        this.addScore(1);
      }
    }
    
    return isAnswerCorrect;
  }

  getScore(): Observable<number> {
    return this.score.asObservable();
  }

  private addScore(points: number): void {
    this.score.next(this.score.value + points);
  }

  resetScore(): void {
    this.score.next(0);
  }
}
