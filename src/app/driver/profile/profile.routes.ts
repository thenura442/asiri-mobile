import { Routes } from '@angular/router';

export const DRIVER_PROFILE_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/profile-view/profile-view.component').then(m => m.DriverProfileViewComponent),
  },
];