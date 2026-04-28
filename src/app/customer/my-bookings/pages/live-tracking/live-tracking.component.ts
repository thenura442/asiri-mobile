import { Component, OnInit, OnDestroy, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IonContent } from '@ionic/angular/standalone';
import { MyBookingsService } from '../../services/my-bookings.service';
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
  private router  = inject(Router);

  detail    = signal<BookingDetail | null>(null);
  etaMinutes = signal(12);
  isLoading = signal(true);

  // Simulated ETA countdown
  private etaInterval?: ReturnType<typeof setInterval>;

  async ngOnInit(): Promise<void> {
    const id = this.route.snapshot.paramMap.get('id') ?? '';
    const data = await this.service.getDetail(id);
    this.detail.set(data);
    this.etaMinutes.set(data.etaMinutes ?? 12);
    this.isLoading.set(false);

    // Simulate ETA countdown for demo
    this.etaInterval = setInterval(() => {
      this.etaMinutes.update(v => Math.max(0, v - 1));
    }, 60000);
  }

  ngOnDestroy(): void {
    clearInterval(this.etaInterval);
  }

  requestNumber = () => this.detail()?.requestNumber ?? '';
  timeline      = (): TimelineStep[] => this.detail()?.timeline ?? [];
  driver        = () => this.detail()?.driver ?? null;

  onCancel(): void {
    // In production: show confirm modal
  }

  goBack(): void { this.router.navigate(['/customer/tabs/bookings']); }
}