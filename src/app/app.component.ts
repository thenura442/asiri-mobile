import { Component, OnInit, inject } from '@angular/core';
import { IonApp, IonRouterOutlet, NavController } from '@ionic/angular/standalone';
import { StorageService } from './shared/services/storage.service';
import { AuthService } from './shared/services/auth.service';
import { AuthUser } from './shared/models/auth.model';

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
  private auth    = inject(AuthService);

  async ngOnInit() {
    // Load user into auth signal first
    await this.auth.loadSession();

    const token = await this.storage.get<string>('accessToken');
    const user  = await this.storage.get<AuthUser>('authUser');

    if (token && user) {
      const destination = user.role === 'driver'
        ? '/driver/tabs/my-job'
        : '/customer/tabs/home';
      this.nav.navigateRoot(destination);
    }
  }
}