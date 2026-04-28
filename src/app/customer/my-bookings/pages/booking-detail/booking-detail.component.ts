import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IonContent } from '@ionic/angular/standalone';
import { MyBookingsService } from '../../services/my-bookings.service';
import { BookingDetail } from '../../models/my-bookings.model';
import { TitleCasePipe } from '@angular/common';

@Component({
  selector: 'app-booking-detail',
  standalone: true,
  imports: [IonContent, TitleCasePipe],
  templateUrl: './booking-detail.component.html',
  styleUrls: ['./booking-detail.component.scss'],
})
export class BookingDetailComponent implements OnInit {
  private service = inject(MyBookingsService);
  private route   = inject(ActivatedRoute);
  private router  = inject(Router);

  detail    = signal<BookingDetail | null>(null);
  isLoading = signal(true);

  async ngOnInit(): Promise<void> {
    const id = this.route.snapshot.paramMap.get('id') ?? '';
    const data = await this.service.getDetail(id);
    this.detail.set(data);
    this.isLoading.set(false);
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
    return ['pending','assigned','en_route'].includes(d.status);
  }

  onTrack(): void {
    const id = this.detail()?.id;
    if (id) this.router.navigate(['/customer/my-bookings/tracking', id]);
  }

  onCancel(): void {
    // In production: show confirm modal then call service.cancelBooking
  }

  onReportIssue(): void {
    this.router.navigate(['/customer/tabs/profile/report-issue']);
  }

  goBack(): void { this.router.navigate(['/customer/tabs/bookings']); }
}