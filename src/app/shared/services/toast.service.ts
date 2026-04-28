import { Injectable, inject } from '@angular/core';
import { ToastController } from '@ionic/angular/standalone';

@Injectable({ providedIn: 'root' })
export class ToastService {
  private toastCtrl = inject(ToastController);

  async showSuccess(message: string, duration = 3000): Promise<void> {
    const toast = await this.toastCtrl.create({
      message,
      duration,
      position: 'top',
      color: 'success',
      cssClass: 'asiri-toast asiri-toast--success',
    });
    await toast.present();
  }

  async showError(message: string, duration = 4000): Promise<void> {
    const toast = await this.toastCtrl.create({
      message,
      duration,
      position: 'top',
      color: 'danger',
      cssClass: 'asiri-toast asiri-toast--error',
    });
    await toast.present();
  }

  async showWarning(message: string, duration = 3500): Promise<void> {
    const toast = await this.toastCtrl.create({
      message,
      duration,
      position: 'top',
      color: 'warning',
      cssClass: 'asiri-toast asiri-toast--warning',
    });
    await toast.present();
  }
}