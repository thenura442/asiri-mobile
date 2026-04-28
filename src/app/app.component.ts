import { Component, OnInit, inject } from '@angular/core';
import { IonApp, IonRouterOutlet, NavController } from '@ionic/angular/standalone';
import { StorageService } from './shared/services/storage.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [IonApp, IonRouterOutlet],
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  private storage = inject(StorageService);
  private nav     = inject(NavController);

  async ngOnInit() {
    const token    = await this.storage.get('access_token');
    const userJson = await this.storage.get('user');

    if (token && userJson) {
      const user = JSON.parse(userJson) as { role: string };
      const destination = user.role === 'driver'
        ? '/driver/tabs/my-job'
        : '/customer/tabs/home';
      this.nav.navigateRoot(destination);
    }
  }
}