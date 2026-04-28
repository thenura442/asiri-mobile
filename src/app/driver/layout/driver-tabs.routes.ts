import { Routes } from '@angular/router';

export const DRIVER_TAB_ROUTES: Routes = [
  { path: '', redirectTo: 'my-job', pathMatch: 'full' },
  {
    path: 'my-job',
    loadComponent: () =>
      import('../my-job/pages/active-job/active-job.component').then(m => m.ActiveJobComponent),
  },
  // {
  //   path: 'history',
  //   loadChildren: () =>
  //     import('../history/history.routes').then(m => m.DRIVER_HISTORY_ROUTES),
  // },
  // {
  //   path: 'alerts',
  //   loadChildren: () =>
  //     import('../alerts/alerts.routes').then(m => m.DRIVER_ALERTS_ROUTES),
  // },
  // {
  //   path: 'profile',
  //   loadChildren: () =>
  //     import('../profile/profile.routes').then(m => m.DRIVER_PROFILE_ROUTES),
  // },
];