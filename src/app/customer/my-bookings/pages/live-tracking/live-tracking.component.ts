import { Component, OnInit, OnDestroy, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IonContent, NavController } from '@ionic/angular/standalone';
import { MyBookingsService } from '../../services/my-bookings.service';
import { ToastService } from '../../../../shared/services/toast.service';
import { BookingDetail, TimelineStep } from '../../models/my-bookings.model';

@Component({
  selector: 'app-live-tracking',
  standalone: true,
  imports: [IonContent],
  templateUrl: './live-tracking.component.html',
  styleUrls: ['./live-tracking.component.scss'],
})
export class LiveTrackingComponent implements OnInit, OnDestroy {
  private service = inject(MyBookingsService);
  private route   = inject(ActivatedRoute);
  private nav     = inject(NavController);
  private toast   = inject(ToastService);

  detail       = signal<BookingDetail | null>(null);
  etaMinutes   = signal(12);
  isLoading    = signal(true);
  isCancelling = signal(false);

  private etaInterval?: ReturnType<typeof setInterval>;
  private bookingId = '';

  async ngOnInit(): Promise<void> {
    this.bookingId = this.route.snapshot.paramMap.get('id') ?? '';
    try {
      const data = await this.service.getDetail(this.bookingId);
      this.detail.set(data);
      this.etaMinutes.set(data.etaMinutes ?? 12);

      this.etaInterval = setInterval(() => {
        this.etaMinutes.update(v => Math.max(0, v - 1));
      }, 60000);
    } catch {
      // interceptor handles error toast
    } finally {
      this.isLoading.set(false);
    }
  }

  ngOnDestroy(): void {
    clearInterval(this.etaInterval);
  }

  requestNumber = () => this.detail()?.requestNumber ?? '';
  timeline      = (): TimelineStep[] => this.detail()?.timeline ?? [];
  driver        = () => this.detail()?.driver ?? null;

  async onCancel(): Promise<void> {
    if (!this.bookingId) return;
    this.isCancelling.set(true);
    try {
      await this.service.cancelBooking(this.bookingId);
      await this.toast.showSuccess('Booking cancelled successfully.');
      this.nav.navigateRoot('/customer/tabs/bookings');
    } catch {
      // interceptor handles error toast
    } finally {
      this.isCancelling.set(false);
    }
  }

  goBack(): void { this.nav.back(); }
}