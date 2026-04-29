import { Routes } from '@angular/router';

export const DRIVER_ALERTS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/notification-list/notification-list.component').then(m => m.NotificationListComponent),
  },
];