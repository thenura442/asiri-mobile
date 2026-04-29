import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { NavController } from '@ionic/angular/standalone';
import { StorageService } from '../../services/storage.service';
import { AuthUser } from '../../models/auth.model';

export const guestGuard: CanActivateFn = async () => {
  const storage = inject(StorageService);
  const nav     = inject(NavController);

  try {
    const token = await storage.get<string>('accessToken');
    const user  = await storage.get<AuthUser>('authUser');

    if (token && user) {
      const destination = user.role === 'driver'
        ? '/driver/tabs/my-job'
        : '/customer/tabs/home';
      nav.navigateRoot('/landing');
      return false;
    }
  } catch {
    // storage empty or parse error — treat as guest
  }

  return true;
};