import { Routes } from '@angular/router';
import { FlashcardComponent } from './components/flashcard/flashcard.component';

export const routes: Routes = [
  { path: '', redirectTo: 'education/flashcards', pathMatch: 'full' },
  { 
    path: 'education/flashcards', 
    component: FlashcardComponent,
    title: 'ادوکادو - آموزش زیست‌شناسی با فلش‌کارت‌های تعاملی'
  },
  { 
    path: 'education/flashcards/:topic', 
    component: FlashcardComponent,
    title: 'ادوکادو - آموزش زیست‌شناسی با فلش‌کارت‌های تعاملی'
  },
  { 
    path: 'education/flashcards/:topic/:uniqueCode', 
    component: FlashcardComponent,
    title: 'ادوکادو - آموزش زیست‌شناسی با فلش‌کارت‌های تعاملی'
  },
  { path: '**', redirectTo: 'education/flashcards' }
];
