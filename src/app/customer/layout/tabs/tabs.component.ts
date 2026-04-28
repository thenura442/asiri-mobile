import { Component, inject, signal } from '@angular/core';
import { Router, RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { IonRouterOutlet } from '@ionic/angular/standalone';

@Component({
  selector: 'app-tabs',
  standalone: true,
  imports: [IonRouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss'],
})
export class TabsComponent {
  private router = inject(Router);

  // Notification badge count — wired to notification service in Batch 5
  notificationCount = signal(2);

  get hasNotifications(): boolean {
    return this.notificationCount() > 0;
  }

  bookTest(): void {
    this.router.navigate(['/customer/booking/select-tests']);
  }
}