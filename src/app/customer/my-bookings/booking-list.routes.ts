import { Routes } from '@angular/router';

export const BOOKING_LIST_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/booking-list/booking-list.component').then(m => m.BookingListComponent),
  },
];