import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'education/flashcards/:topic',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: async () => Promise.resolve([
      { topic: 'متابولیسم سلولی' },
      { topic: 'اندامک‌های سلولی' },
      { topic: 'تنفس سلولی' },
      { topic: 'ساختار سلول گیاهی' },
      { topic: 'تخمیر و متابولیسم' }
    ])
  },
  {
    path: 'education/flashcards/:topic/:uniqueCode',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: async () => Promise.resolve([
      { topic: 'متابولیسم سلولی', uniqueCode: 'A7X9F2D5' },
      { topic: 'اندامک‌های سلولی', uniqueCode: 'B3K7L8P2' },
      { topic: 'تنفس سلولی', uniqueCode: 'C5R2M9V4' },
      { topic: 'ساختار سلول گیاهی', uniqueCode: 'D8E3N7S1' },
      { topic: 'تخمیر و متابولیسم', uniqueCode: 'E6W1Z4G8' }
    ])
  },
  {
    path: 'education/flashcards',
    renderMode: RenderMode.Prerender
  },
  {
    path: '',
    renderMode: RenderMode.Prerender
  }
];
