import { Routes } from '@angular/router';

export const DRIVER_JOB_ROUTES: Routes = [
  {
    path: 'detail/:id',
    loadComponent: () =>
      import('./pages/job-detail/job-detail.component').then(m => m.JobDetailComponent),
  },
];