import { Component, inject, signal } from '@angular/core';
import { IonRouterOutlet, NavController } from '@ionic/angular/standalone';

@Component({
  selector: 'app-tabs',
  standalone: true,
  imports: [IonRouterOutlet],
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss'],
})
export class TabsComponent {
  private nav = inject(NavController);

  activeTab = signal<string>('home');
  notificationCount = signal(2);

  get hasNotifications(): boolean {
    return this.notificationCount() > 0;
  }

  goTo(tab: string): void {
    this.activeTab.set(tab);
    this.nav.navigateRoot(`/customer/tabs/${tab}`, { animated: false });
  }

  bookTest(): void {
    this.nav.navigateForward('/customer/booking/select-tests');
  }
}