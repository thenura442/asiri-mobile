import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute} from '@angular/router';
import { IonContent } from '@ionic/angular/standalone';
import { MyBookingsService } from '../../services/my-bookings.service';
import { ToastService } from '../../../../shared/services/toast.service';
import { BookingDetail } from '../../models/my-bookings.model';
import { TitleCasePipe } from '@angular/common';
import { NavController } from '@ionic/angular/standalone';

@Component({
  selector: 'app-booking-detail',
  standalone: true,
  host: { class: 'ion-page' },
  imports: [IonContent, TitleCasePipe],
  templateUrl: './booking-detail.component.html',
  styleUrls: ['./booking-detail.component.scss'],
})
export class BookingDetailComponent implements OnInit {
  private service = inject(MyBookingsService);
  private route   = inject(ActivatedRoute);
  private nav     = inject(NavController);
  private toast   = inject(ToastService);

  detail      = signal<BookingDetail | null>(null);
  isLoading   = signal(true);
  isCancelling = signal(false);

  async ngOnInit(): Promise<void> {
    try {
      const id = this.route.snapshot.paramMap.get('id') ?? '';
      const data = await this.service.getDetail(id);
      this.detail.set(data);
    } catch {
      // interceptor handles error toast
    } finally {
      this.isLoading.set(false);
    }
  }

  formatPrice(p: number): string {
    return `Rs. ${p.toLocaleString('en-LK')}`;
  }

  isEnRoute(): boolean {
    return this.detail()?.status === 'en_route';
  }

  canCancel(): boolean {
    const d = this.detail();
    if (!d) return false;
    return ['pending', 'assigned', 'en_route'].includes(d.status);
  }

  onTrack(): void {
    const id = this.detail()?.id;
    if (id) this.nav.navigateRoot(['/customer/my-bookings/tracking', id]);
  }

  async onCancel(): Promise<void> {
    const id = this.detail()?.id;
    if (!id) return;
    this.isCancelling.set(true);
    try {
      await this.service.cancelBooking(id);
      await this.toast.showSuccess('Booking cancelled successfully.');
      this.nav.navigateRoot(['/customer/tabs/bookings'], { replaceUrl: true });
    } catch {
      // interceptor handles error toast
    } finally {
      this.isCancelling.set(false);
    }
  }

  onReportIssue(): void {
    this.nav.navigateRoot(['/customer/profile/report-issue']);
  }

  goBack(): void { this.nav.navigateRoot(['/customer/tabs/bookings']); }
}