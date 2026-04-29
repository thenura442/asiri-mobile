import { Component, inject, signal, computed } from '@angular/core';
import { IonContent } from '@ionic/angular/standalone';
import { NavController } from '@ionic/angular/standalone';
import { BookingStateService } from '../../services/booking-state.service';
import { BookingService } from '../../services/booking.service';
import { ToastService } from '../../../../shared/services/toast.service';
import { AuthService } from '../../../../shared/services/auth.service';

@Component({
  selector: 'app-confirm',
  standalone: true,
  host: { class: 'ion-page' },
  imports: [IonContent],
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.scss'],
})
export class ConfirmComponent {
  private bookingState   = inject(BookingStateService);
  private bookingService = inject(BookingService);
  private toast          = inject(ToastService);
  private nav            = inject(NavController);
  private auth           = inject(AuthService);

  isLoading = signal(false);

  // Read from booking state
  selectedTests  = this.bookingState.selectedTests;
  location       = this.bookingState.location;
  schedule       = this.bookingState.schedule;
  priceBreakdown = this.bookingState.priceBreakdown;

  // Read from auth state — real user data
  patient = computed(() => ({
    name:  this.auth.user()?.fullName ?? 'Unknown',
    phone: this.auth.user()?.phone    ?? '—',
  }));

  formatPrice(p: number): string {
    return `Rs. ${Number(p).toLocaleString('en-US')}`;
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
      this.bookingState.reset();
      this.nav.navigateRoot('/customer/booking/success', {
        state: {
          requestNumber: result.requestNumber,
          etaMinutes:    result.etaMinutes,
        }
      });
    } catch {
      // interceptor handles error toast
    } finally {
      this.isLoading.set(false);
    }
  }

  goBack(): void {
    this.nav.navigateRoot('/customer/booking/schedule');
  }
}