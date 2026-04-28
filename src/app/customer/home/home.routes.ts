import { Routes } from '@angular/router';

export const CUSTOMER_HOME_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/home/home.component').then(m => m.HomeComponent),
  },
];