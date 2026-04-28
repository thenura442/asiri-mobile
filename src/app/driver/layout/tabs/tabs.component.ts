import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { IonContent } from '@ionic/angular/standalone';

interface DriverTab {
  label:  string;
  route:  string;
  ariaLabel: string;
}

@Component({
  selector: 'app-driver-tabs',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss'],
})
export class DriverTabsComponent {
  readonly tabs: DriverTab[] = [
    { label: 'My Job',  route: '/driver/tabs/my-job',  ariaLabel: 'My active job' },
    { label: 'History', route: '/driver/tabs/history', ariaLabel: 'Job history'   },
    { label: 'Alerts',  route: '/driver/tabs/alerts',  ariaLabel: 'Notifications' },
    { label: 'Profile', route: '/driver/tabs/profile', ariaLabel: 'Profile'       },
  ];
}