import { Routes } from '@angular/router';

export const MY_BOOKINGS_ROUTES: Routes = [
  {
    path: 'detail/:id',
    loadComponent: () =>
      import('./pages/booking-detail/booking-detail.component').then(m => m.BookingDetailComponent),
  },
  {
    path: 'tracking/:id',
    loadComponent: () =>
      import('./pages/live-tracking/live-tracking.component').then(m => m.LiveTrackingComponent),
  },
];