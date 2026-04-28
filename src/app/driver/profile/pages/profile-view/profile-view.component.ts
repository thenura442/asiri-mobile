import { Component, OnInit, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { IonContent } from '@ionic/angular/standalone';
import { DriverProfileService } from '../../services/driver-profile.service';
import { AuthService } from '../../../../shared/services/auth.service';
import { DriverProfile } from '../../models/driver-profile.model';

@Component({
  selector: 'app-driver-profile-view',
  standalone: true,
  imports: [IonContent],
  templateUrl: './profile-view.component.html',
  styleUrls: ['./profile-view.component.scss'],
})
export class DriverProfileViewComponent implements OnInit {
  private profileService = inject(DriverProfileService);
  private auth           = inject(AuthService);
  private router         = inject(Router);

  profile   = signal<DriverProfile | null>(null);
  isOnline  = signal(true);

  async ngOnInit(): Promise<void> {
    const data = await this.profileService.getProfile();
    this.profile.set(data);
  }

  toggleOnline(): void { this.isOnline.update(v => !v); }
  goEmergency():     void { this.router.navigate(['/driver/pushed/emergency']); }
  goContactBranch(): void { this.router.navigate(['/driver/pushed/contact-branch']); }
  goSettings():      void { /* D12 — Batch 6C */ }

  async onLogout(): Promise<void> { await this.auth.logout(); }

  licenseExpiringSoon(): boolean {
    return (this.profile()?.licenseExpiryDaysLeft ?? 999) <= 30;
  }
}