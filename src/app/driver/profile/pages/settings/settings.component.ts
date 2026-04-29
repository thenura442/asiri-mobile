import { Component, signal, inject } from '@angular/core';
import { Router } from '@angular/router';
import { IonContent } from '@ionic/angular/standalone';
import { AuthService } from '../../../../shared/services/auth.service';

type NavApp = 'google' | 'apple' | 'waze';

interface ToggleSetting {
  key:     string;
  label:   string;
  desc:    string;
  value:   boolean;
}

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [IonContent],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent {
  private auth   = inject(AuthService);
  private router = inject(Router);

  notificationSettings = signal<ToggleSetting[]>([
    { key: 'push',      label: 'Push Notifications', desc: 'Receive job assignments and updates', value: true  },
    { key: 'sound',     label: 'Sound',               desc: 'Play alert sound for new notifications', value: true  },
    { key: 'vibration', label: 'Vibration',            desc: 'Vibrate on new job assignments',       value: true  },
  ]);

  selectedNavApp = signal<NavApp>('google');

  readonly navApps: { id: NavApp; label: string; desc: string }[] = [
    { id: 'google', label: 'Google Maps', desc: 'Default navigation app'   },
    { id: 'apple',  label: 'Apple Maps',  desc: 'Built-in iOS navigation'  },
    { id: 'waze',   label: 'Waze',        desc: 'Community-driven navigation' },
  ];

  toggleNotification(key: string): void {
    this.notificationSettings.update(settings =>
      settings.map(s => s.key === key ? { ...s, value: !s.value } : s)
    );
  }

  setNavApp(id: NavApp): void { this.selectedNavApp.set(id); }

  goChangePassword(): void { this.router.navigate(['/driver/pushed/change-password']); }
  goChat():           void { this.router.navigate(['/driver/pushed/chat']); }

  async onLogout(): Promise<void> { await this.auth.logout(); }

  goBack(): void { this.router.navigate(['/driver/tabs/profile']); }
}