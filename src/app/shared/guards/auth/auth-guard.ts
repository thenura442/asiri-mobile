import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { NavController } from '@ionic/angular/standalone';
import { StorageService } from '../../services/storage.service';

export const authGuard: CanActivateFn = async () => {
  const storage = inject(StorageService);
  const nav     = inject(NavController);

  const token = await storage.get('access_token');
  if (!token) {
    nav.navigateRoot('/');
    return false;
  }
  return true;
};