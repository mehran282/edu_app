import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'education/flashcards/:topic',
    renderMode: RenderMode.Server
  },
  {
    path: 'education/flashcards/:topic/:uniqueCode',
    renderMode: RenderMode.Server
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender
  }
];
