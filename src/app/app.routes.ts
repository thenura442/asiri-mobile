import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./landing/landing.component').then(m => m.LandingComponent),
  },
  {
    path: 'customer',
    children: [
      { path: 'auth',        loadChildren: () => import('./customer/auth/auth.routes').then(m => m.CUSTOMER_AUTH_ROUTES) },
      { path: 'tabs',        loadComponent: () => import('./customer/layout/tabs/tabs.component').then(m => m.TabsComponent),
                             loadChildren:  () => import('./customer/layout/tabs.routes').then(m => m.CUSTOMER_TAB_ROUTES) },
      { path: 'booking',     loadChildren: () => import('./customer/booking/booking.routes').then(m => m.BOOKING_ROUTES) },
      { path: 'my-bookings', loadChildren: () => import('./customer/my-bookings/my-bookings.routes').then(m => m.MY_BOOKINGS_ROUTES) },
      { path: 'reports',     loadChildren: () => import('./customer/reports/report-detail.routes').then(m => m.REPORT_DETAIL_ROUTES) },
      { path: 'profile',     loadChildren: () => import('./customer/profile/profile-pushed.routes').then(m => m.PROFILE_PUSHED_ROUTES) },
      { path: '', redirectTo: 'auth', pathMatch: 'full' },
    ],
  },
  {
    path: 'driver',
    children: [
      { path: 'auth',       loadChildren: () => import('./driver/auth/auth.routes').then(m => m.DRIVER_AUTH_ROUTES) },
      { path: 'tabs',       loadComponent: () => import('./driver/layout/tabs/tabs.component').then(m => m.DriverTabsComponent),
                            loadChildren:  () => import('./driver/layout/driver-tabs.routes').then(m => m.DRIVER_TAB_ROUTES) },
      { path: 'job',        loadChildren: () => import('./driver/my-job/my-job.routes').then(m => m.DRIVER_JOB_ROUTES) },
      { path: 'collection', loadChildren: () => import('./driver/collection/collection.routes').then(m => m.COLLECTION_ROUTES) },
      // { path: 'pushed',     loadChildren: () => import('./driver/profile/pushed.routes').then(m => m.DRIVER_PUSHED_ROUTES) },
      { path: '', redirectTo: 'auth', pathMatch: 'full' },
    ],
  },
  { path: '**', redirectTo: '' },
];