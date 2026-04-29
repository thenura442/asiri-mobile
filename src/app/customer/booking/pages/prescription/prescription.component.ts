import { Component, inject, signal, computed, ElementRef, ViewChild } from '@angular/core';
import { IonContent } from '@ionic/angular/standalone';
import { NavController } from '@ionic/angular/standalone';
import { BookingStateService } from '../../services/booking-state.service';
import { ToastService } from '../../../../shared/services/toast.service';

@Component({
  selector: 'app-prescription',
  standalone: true,
  host: { class: 'ion-page' },
  imports: [IonContent],
  templateUrl: './prescription.component.html',
  styleUrls: ['./prescription.component.scss'],
})
export class PrescriptionComponent {
  private booking = inject(BookingStateService);
  private nav     = inject(NavController);
  private toast   = inject(ToastService);

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  uploaded  = signal(false);
  fileName  = signal('');
  fileSize  = signal('');
  fileUrl   = signal<string | null>(null);
  isLoading = signal(false);

  rxTests = computed(() =>
    this.booking.selectedTests().filter(t => t.prescriptionReq)
  );

  onUploadClick(): void {
    this.fileInput.nativeElement.click();
  }

  async onFileSelected(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    const file  = input.files?.[0];
    if (!file) return;

    // Validate type
    if (!['image/jpeg', 'image/png', 'application/pdf'].includes(file.type)) {
      await this.toast.showError('Please upload a JPG, PNG or PDF file.');
      return;
    }

    // Validate size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      await this.toast.showError('File size must be under 10MB.');
      return;
    }

    this.isLoading.set(true);

    try {
      // Create local object URL for preview
      const url = URL.createObjectURL(file);
      const sizeMb = (file.size / (1024 * 1024)).toFixed(1);

      this.fileUrl.set(url);
      this.fileName.set(file.name);
      this.fileSize.set(`${sizeMb} MB`);
      this.uploaded.set(true);

      // Store URL in booking state
      // In production: upload to Supabase Storage here and store the returned URL
      this.booking.setPrescription(url);
    } finally {
      this.isLoading.set(false);
      // Reset input so same file can be re-selected
      input.value = '';
    }
  }

  removeFile(): void {
    // Revoke object URL to free memory
    const url = this.fileUrl();
    if (url) URL.revokeObjectURL(url);

    this.uploaded.set(false);
    this.fileName.set('');
    this.fileSize.set('');
    this.fileUrl.set(null);
    this.booking.setPrescription(null);
  }

  onContinue(): void {
    this.nav.navigateRoot('/customer/booking/location');
  }

  onSkip(): void {
    this.booking.setPrescription(null);
    this.nav.navigateRoot('/customer/booking/location');
  }

  goBack(): void {
    this.nav.navigateRoot('/customer/booking/select-tests');
  }

  get isImageFile(): boolean {
    const name = this.fileName();
    return /\.(jpg|jpeg|png)$/i.test(name);
  }
}