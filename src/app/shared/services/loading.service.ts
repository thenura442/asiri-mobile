import { Injectable, inject } from '@angular/core';
import { LoadingController } from '@ionic/angular/standalone';

@Injectable({ providedIn: 'root' })
export class LoadingService {
  private loadingCtrl = inject(LoadingController);
  private loader: HTMLIonLoadingElement | null = null;

  async show(message = ''): Promise<void> {
    if (this.loader) return;
    this.loader = await this.loadingCtrl.create({
      message,
      spinner: 'crescent',
      cssClass: 'asiri-loading',
      backdropDismiss: false,
    });
    await this.loader.present();
  }

  async hide(): Promise<void> {
    if (!this.loader) return;
    await this.loader.dismiss();
    this.loader = null;
  }
}