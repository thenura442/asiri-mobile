import { Routes } from '@angular/router';

export const REPORTS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/report-list/report-list.component').then(m => m.ReportListComponent),
  },
];