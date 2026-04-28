import { Routes } from '@angular/router';

export const DRIVER_HISTORY_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/job-history/job-history.component').then(m => m.JobHistoryComponent),
  },
];