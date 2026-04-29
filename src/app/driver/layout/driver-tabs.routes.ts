import { Routes } from '@angular/router';

export const DRIVER_TAB_ROUTES: Routes = [
  { path: '', redirectTo: 'my-job', pathMatch: 'full' },
  {
    path: 'my-job',
    loadComponent: () =>
      import('../my-job/pages/active-job/active-job.component').then(m => m.ActiveJobComponent),
  },
  {
    path: 'history',
    loadComponent: () =>
      import('../history/pages/job-history/job-history.component').then(m => m.JobHistoryComponent),
  },
  {
    path: 'alerts',
    loadComponent: () =>
      import('../alerts/pages/notification-list/notification-list.component').then(m => m.NotificationListComponent),
  },
  {
    path: 'profile',
    loadComponent: () =>
      import('../profile/pages/profile-view/profile-view.component').then(m => m.DriverProfileViewComponent),
  },
];