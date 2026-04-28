import { Routes } from '@angular/router';

export const BOOKING_ROUTES: Routes = [
  {
    path: 'select-tests',
    loadComponent: () =>
      import('./pages/select-tests/select-tests.component').then(m => m.SelectTestsComponent),
  },
  {
    path: 'prescription',
    loadComponent: () =>
      import('./pages/prescription/prescription.component').then(m => m.PrescriptionComponent),
  },
  {
    path: 'location',
    loadComponent: () =>
      import('./pages/location/location.component').then(m => m.LocationComponent),
  },
  {
    path: 'schedule',
    loadComponent: () =>
      import('./pages/schedule/schedule.component').then(m => m.ScheduleComponent),
  },
  {
    path: 'confirm',
    loadComponent: () =>
      import('./pages/confirm/confirm.component').then(m => m.ConfirmComponent),
  },
  {
    path: 'success',
    loadComponent: () =>
      import('./pages/success/success.component').then(m => m.SuccessComponent),
  },
  { path: '', redirectTo: 'select-tests', pathMatch: 'full' },
];