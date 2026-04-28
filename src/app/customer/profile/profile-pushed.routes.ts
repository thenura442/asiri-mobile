import { Routes } from '@angular/router';

export const PROFILE_PUSHED_ROUTES: Routes = [
  {
    path: 'edit',
    loadComponent: () =>
      import('./pages/profile-edit/profile-edit.component').then(m => m.ProfileEditComponent),
  },
  {
    path: 'report-issue',
    loadComponent: () =>
      import('./pages/report-issue/report-issue.component').then(m => m.ReportIssueComponent),
  },
];