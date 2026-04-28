import { Component, inject, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { IonContent } from '@ionic/angular/standalone';
import { BookingStateService } from '../../services/booking-state.service';
import { BookingService } from '../../services/booking.service';
import { ToastService } from '../../../../shared/services/toast.service';

@Component({
  selector: 'app-confirm',
  standalone: true,
  imports: [IonContent],
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.scss'],
})
export class ConfirmComponent {
  private bookingState = inject(BookingStateService);
  private bookingService = inject(BookingService);
  private toast  = inject(ToastService);
  private router = inject(Router);

  isLoading = signal(false);

  // Read from state
  selectedTests  = this.bookingState.selectedTests;
  location       = this.bookingState.location;
  schedule       = this.bookingState.schedule;
  priceBreakdown = this.bookingState.priceBreakdown;

  // Mock patient details from auth
  patient = { name: 'Kavindi Perera', phone: '+94 77 123 4567' };

  formatPrice(p: number): string {
    return `Rs. ${p.toLocaleString('en-LK')}`;
  }

  formatSchedule(): string {
    const s = this.schedule();
    if (!s) return '—';
    if (s.mode === 'now') return 'ASAP — Next available slot';
    return `${s.date} at ${s.timeSlot}`;
  }

  async onConfirm(): Promise<void> {
    this.isLoading.set(true);
    try {
      const result = await this.bookingService.createBooking();
      this.router.navigate(['/customer/booking/success'], {
        state: { requestNumber: result.requestNumber, etaMinutes: result.etaMinutes }
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Booking failed. Please try again.';
      await this.toast.showError(msg);
    } finally {
      this.isLoading.set(false);
    }
  }

  goBack(): void { this.router.navigate(['/customer/booking/schedule']); }
}