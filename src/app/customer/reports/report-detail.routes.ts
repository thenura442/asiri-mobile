import { Routes } from '@angular/router';

export const REPORT_DETAIL_ROUTES: Routes = [
  {
    path: 'detail/:id',
    loadComponent: () =>
      import('./pages/report-detail/report-detail.component').then(m => m.ReportDetailComponent),
  },
];