import { Component, inject, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { IonContent } from '@ionic/angular/standalone';
import { BookingStateService } from '../../services/booking-state.service';

@Component({
  selector: 'app-prescription',
  standalone: true,
  imports: [IonContent],
  templateUrl: './prescription.component.html',
  styleUrls: ['./prescription.component.scss'],
})
export class PrescriptionComponent {
  private booking = inject(BookingStateService);
  private router  = inject(Router);

  uploaded   = signal(false);
  fileName   = signal('');
  fileSize   = signal('');
  isLoading  = signal(false);

  rxTests = computed(() =>
    this.booking.selectedTests().filter(t => t.requiresPrescription)
  );

  async onUpload(): Promise<void> {
    // In production: use Capacitor Camera plugin
    // For now, simulate a successful upload
    this.uploaded.set(true);
    this.fileName.set('prescription_dr_fernando.jpg');
    this.fileSize.set('2.4 MB');
    this.booking.setPrescription('mock://prescription.jpg');
  }

  removeFile(): void {
    this.uploaded.set(false);
    this.fileName.set('');
    this.fileSize.set('');
    this.booking.setPrescription(null);
  }

  onContinue(): void {
    this.router.navigate(['/customer/booking/location']);
  }

  onSkip(): void {
    this.booking.setPrescription(null);
    this.router.navigate(['/customer/booking/location']);
  }

  goBack(): void {
    this.router.navigate(['/customer/booking/select-tests']);
  }
}