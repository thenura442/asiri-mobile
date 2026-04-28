import { Routes } from '@angular/router';

export const CUSTOMER_TAB_ROUTES: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: 'home',
    loadChildren: () => import('../home/home.routes').then(m => m.CUSTOMER_HOME_ROUTES),
  },
  {
    path: 'bookings',
    loadChildren: () => import('../my-bookings/booking-list.routes').then(m => m.BOOKING_LIST_ROUTES),
  },
  {
    path: 'reports',
    loadChildren: () => import('../reports/reports.routes').then(m => m.REPORTS_ROUTES),
  },
  {
    path: 'notifications',
    loadChildren: () => import('../notifications/notifications.routes').then(m => m.NOTIFICATIONS_ROUTES),
  },
  {
    path: 'profile',
    loadChildren: () => import('../profile/profile.routes').then(m => m.PROFILE_ROUTES),
  },
];