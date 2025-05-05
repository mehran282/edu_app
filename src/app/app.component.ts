import { Component } from '@angular/core';
import { FlashcardComponent } from './components/flashcard/flashcard.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FlashcardComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'اپلیکیشن آموزشی ادوکادو';
}
