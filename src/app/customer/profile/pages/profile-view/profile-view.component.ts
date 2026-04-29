import { Component, OnInit, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { IonContent } from '@ionic/angular/standalone';
import { ProfileService } from '../../services/profile.service';
import { CustomerProfile } from '../../models/profile.model';
import { AuthService } from '../../../../shared/services/auth.service';
import { TitleCasePipe } from '@angular/common';

@Component({
  selector: 'app-profile-view',
  standalone: true,
  imports: [IonContent, TitleCasePipe],
  templateUrl: './profile-view.component.html',
  styleUrls: ['./profile-view.component.scss'],
})
export class ProfileViewComponent implements OnInit {
  private profileService = inject(ProfileService);
  private auth           = inject(AuthService);
  private router         = inject(Router);

  profile   = signal<CustomerProfile | null>(null);
  isLoading = signal(true);

  notificationsEnabled = signal(true);

  async ngOnInit(): Promise<void> {
    try {
      const data = await this.profileService.getProfile();
      this.profile.set(data);
    } catch {
      // interceptor handles error toast
    } finally {
      this.isLoading.set(false);
    }
  }

  get initials(): string {
    const p = this.profile();
    if (!p) return '?';
    if (p.firstName && p.lastName) {
      return `${p.firstName[0]}${p.lastName[0]}`.toUpperCase();
    }
    const parts = p.fullName.trim().split(' ');
    return parts.length >= 2
      ? `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
      : parts[0][0].toUpperCase();
  }

  formatAmount(n: number): string {
    return `Rs. ${n.toLocaleString('en-LK')}`;
  }

  goEdit():          void { this.router.navigate(['/customer/profile/edit']); }
  goReportIssue():   void { this.router.navigate(['/customer/profile/report-issue']); }
  goNotifications(): void { this.router.navigate(['/customer/tabs/notifications']); }

  toggleNotifications(): void {
    this.notificationsEnabled.update(v => !v);
  }

  async onLogout(): Promise<void> {
    await this.auth.logout();
  }
}