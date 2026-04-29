import { Component, inject, signal } from '@angular/core';
import { IonRouterOutlet, NavController } from '@ionic/angular/standalone';

@Component({
  selector: 'app-driver-tabs',
  standalone: true,
  imports: [IonRouterOutlet],
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss'],
})
export class DriverTabsComponent {
  private nav = inject(NavController);

  activeTab = signal<string>('my-job');

  goTo(tab: string): void {
    this.activeTab.set(tab);
    this.nav.navigateRoot(`/driver/tabs/${tab}`, { animated: false });
  }
}