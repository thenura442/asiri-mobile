import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { NavController } from '@ionic/angular/standalone';
import { StorageService } from '../../services/storage.service';

export const guestGuard: CanActivateFn = async () => {
  const storage = inject(StorageService);
  const nav     = inject(NavController);

  const token    = await storage.get('access_token');
  const userJson = await storage.get('user');

  if (token && userJson) {
    const user = JSON.parse(userJson) as { role: string };
    const destination = user.role === 'driver'
      ? '/driver/tabs/my-job'
      : '/customer/tabs/home';
    nav.navigateRoot(destination);
    return false;
  }
  return true;
};