import { Routes } from '@angular/router';

export const DRIVER_PUSHED_ROUTES: Routes = [
  {
    path: 'emergency',
    loadComponent: () =>
      import('./pages/emergency/emergency.component').then(m => m.EmergencyComponent),
  },
  {
    path: 'contact-branch',
    loadComponent: () =>
      import('./pages/contact-branch/contact-branch.component').then(m => m.ContactBranchComponent),
  },
  {
    path: 'settings',
    loadComponent: () =>
      import('./pages/settings/settings.component').then(m => m.SettingsComponent),
  },
  {
    path: 'chat',
    loadComponent: () =>
      import('./pages/chat/chat.component').then(m => m.ChatComponent),
  },
  {
    path: 'change-password',
    loadComponent: () =>
      import('./pages/change-password/change-password.component').then(m => m.ChangePasswordComponent),
  },
];