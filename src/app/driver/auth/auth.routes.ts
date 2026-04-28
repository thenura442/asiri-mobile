import { Routes } from '@angular/router';

export const DRIVER_AUTH_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login.component').then(m => m.DriverLoginComponent),
  },
  {
    path: 'two-factor',
    loadComponent: () =>
      import('./pages/two-factor/two-factor.component').then(m => m.TwoFactorComponent),
  },
];