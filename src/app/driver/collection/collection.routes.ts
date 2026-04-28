import { Routes } from '@angular/router';

export const COLLECTION_ROUTES: Routes = [
  {
    path: ':id',
    loadComponent: () =>
      import('./pages/collection-checklist/collection-checklist.component').then(m => m.CollectionChecklistComponent),
  },
];