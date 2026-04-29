import { Routes } from '@angular/router';
import { guestGuard } from './shared/guards/guest/guest-guard';
import { authGuard } from './shared/guards/auth/auth-guard';

export const routes: Routes = [
  // Landing
  {
    path: '',
    loadComponent: () =>
      import('./landing/landing.component').then(m => m.LandingComponent),
  },

  // ── Customer Auth ─────────────────────────────────────────────────────────
  {
    path: 'customer/auth/login',
    canActivate: [guestGuard],
    loadComponent: () =>
      import('./customer/auth/pages/login/login.component').then(m => m.LoginComponent),
  },
  {
    path: 'customer/auth/register',
    canActivate: [guestGuard],
    loadComponent: () =>
      import('./customer/auth/pages/register/register.component').then(m => m.RegisterComponent),
  },
  {
    path: 'customer/auth/otp-verify',
    canActivate: [guestGuard],
    loadComponent: () =>
      import('./customer/auth/pages/otp-verify/otp-verify.component').then(m => m.OtpVerifyComponent),
  },
  {
    path: 'customer/auth/forgot-password',
    canActivate: [guestGuard],
    loadComponent: () =>
      import('./customer/auth/pages/forgot-password/forgot-password.component').then(m => m.ForgotPasswordComponent),
  },
  {
    path: 'customer/auth/reset-password',
    canActivate: [guestGuard],
    loadComponent: () =>
      import('./customer/auth/pages/reset-password/reset-password.component').then(m => m.ResetPasswordComponent),
  },

  // ── Customer Tabs ─────────────────────────────────────────────────────────
  {
    path: 'customer/tabs',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./customer/layout/tabs/tabs.component').then(m => m.TabsComponent),
    loadChildren: () =>
      import('./customer/layout/tabs.routes').then(m => m.CUSTOMER_TAB_ROUTES),
  },

  // ── Customer Pushed Routes ────────────────────────────────────────────────
  {
    path: 'customer/booking',
    canActivate: [authGuard],
    loadChildren: () =>
      import('./customer/booking/booking.routes').then(m => m.BOOKING_ROUTES),
  },
  {
    path: 'customer/my-bookings',
    canActivate: [authGuard],
    loadChildren: () =>
      import('./customer/my-bookings/my-bookings.routes').then(m => m.MY_BOOKINGS_ROUTES),
  },
  {
    path: 'customer/reports',
    canActivate: [authGuard],
    loadChildren: () =>
      import('./customer/reports/report-detail.routes').then(m => m.REPORT_DETAIL_ROUTES),
  },
  {
    path: 'customer/profile',
    canActivate: [authGuard],
    loadChildren: () =>
      import('./customer/profile/profile-pushed.routes').then(m => m.PROFILE_PUSHED_ROUTES),
  },

  // ── Driver Auth ───────────────────────────────────────────────────────────
  {
    path: 'driver/auth/login',
    canActivate: [guestGuard],
    loadComponent: () =>
      import('./driver/auth/pages/login/login.component').then(m => m.DriverLoginComponent),
  },
  {
    path: 'driver/auth/two-factor',
    canActivate: [guestGuard],
    loadComponent: () =>
      import('./driver/auth/pages/two-factor/two-factor.component').then(m => m.TwoFactorComponent),
  },

  // ── Driver Tabs shell ─────────────────────────────────────────────────────
  {
    path: 'driver/tabs',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./driver/layout/tabs/tabs.component').then(m => m.DriverTabsComponent),
    children: [
      { path: '', redirectTo: 'my-job', pathMatch: 'full' },
      {
        path: 'my-job',
        loadComponent: () =>
          import('./driver/my-job/pages/active-job/active-job.component').then(m => m.ActiveJobComponent),
      },
      {
        path: 'history',
        loadComponent: () =>
          import('./driver/history/pages/job-history/job-history.component').then(m => m.JobHistoryComponent),
      },
      {
        path: 'alerts',
        loadComponent: () =>
          import('./driver/alerts/pages/notification-list/notification-list.component').then(m => m.NotificationListComponent),
      },
      {
        path: 'profile',
        loadComponent: () =>
          import('./driver/profile/pages/profile-view/profile-view.component').then(m => m.DriverProfileViewComponent),
      },
    ],
  },

  // ── Driver Pushed Routes ──────────────────────────────────────────────────
  {
    path: 'driver/job',
    canActivate: [authGuard],
    loadChildren: () =>
      import('./driver/my-job/my-job.routes').then(m => m.DRIVER_JOB_ROUTES),
  },
  {
    path: 'driver/collection',
    canActivate: [authGuard],
    loadChildren: () =>
      import('./driver/collection/collection.routes').then(m => m.COLLECTION_ROUTES),
  },
  {
    path: 'driver/pushed/emergency',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./driver/profile/pages/emergency/emergency.component').then(m => m.EmergencyComponent),
  },
  {
    path: 'driver/pushed/contact-branch',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./driver/profile/pages/contact-branch/contact-branch.component').then(m => m.ContactBranchComponent),
  },
  // {
  //   path: 'driver/pushed/settings',
  //   canActivate: [authGuard],
  //   loadComponent: () =>
  //     import('./driver/profile/pages/settings/settings.component').then(m => m.DriverSettingsComponent),
  // },
  // {
  //   path: 'driver/pushed/chat',
  //   canActivate: [authGuard],
  //   loadComponent: () =>
  //     import('./driver/profile/pages/chat/chat.component').then(m => m.DriverChatComponent),
  // },
  {
    path: 'driver/pushed/change-password',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./driver/profile/pages/change-password/change-password.component').then(m => m.ChangePasswordComponent),
  },

  // Fallback
  { path: '**', redirectTo: '' },
];