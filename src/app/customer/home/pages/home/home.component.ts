import { Component, OnInit, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { HomeService } from '../../services/home.service';
import { CustomerHomeData } from '../../models/home.model';
import { GreetingHeaderComponent } from '../../components/greeting-header/greeting-header.component';
import { ActiveBookingCardComponent } from '../../components/active-booking-card/active-booking-card.component';
import { PendingChargesBannerComponent } from '../../components/pending-charges-banner/pending-charges-banner.component';
import { QuickActionsComponent } from '../../components/quick-actions/quick-actions.component';
import { RecentBookingsListComponent } from '../../components/recent-bookings-list/recent-bookings-list.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    GreetingHeaderComponent,
    ActiveBookingCardComponent,
    PendingChargesBannerComponent,
    QuickActionsComponent,
    RecentBookingsListComponent,
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  private homeService = inject(HomeService);
  private router      = inject(Router);

  homeData    = signal<CustomerHomeData | null>(null);
  isLoading   = signal(true);
  sheetOpen   = signal(false);

  // Greeting based on time of day
  get greeting(): string {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning,';
    if (h < 17) return 'Good afternoon,';
    return 'Good evening,';
  }

  ngOnInit(): void {
    this.loadData();
  }

  private async loadData(): Promise<void> {
    try {
      const data = await this.homeService.getHomeData();
      this.homeData.set(data);
    } catch {
      // In dev / before backend, use mock data so the UI is visible
      this.homeData.set(this.mockData());
    } finally {
      this.isLoading.set(false);
    }
  }

  toggleSheet(): void {
    this.sheetOpen.update(v => !v);
  }

  onBookTest(): void {
    this.router.navigate(['/customer/booking/select-tests']);
  }

  onTrackBooking(id: string): void {
    this.router.navigate(['/customer/tabs/bookings/tracking', id]);
  }

  onViewAllBookings(): void {
    this.router.navigate(['/customer/tabs/bookings']);
  }

  onNotifications(): void {
    this.router.navigate(['/customer/tabs/notifications']);
  }

  // ── Mock data for development ─────────────────────────────────────
  private mockData(): CustomerHomeData {
    return {
      profile: { fullName: 'Kavindi Perera', firstName: 'Kavindi', avatarUrl: null },
      stats: { totalBookings: 12, totalReports: 7, activeBookings: 1 },
      pendingCharges: 450,
      activeBooking: {
        id: 'abc123',
        requestNumber: 'REQ-2026-0847',
        statusLabel: 'En Route',
        tests: ['Full Blood Count', 'HbA1c', 'Lipid Profile'],
        etaMinutes: 12,
        location: 'Colombo 07',
        driverName: 'Kamal S.',
        progressStep: 1,
      },
      recentBookings: [
        { id: 'r1', requestNumber: 'REQ-0831', testNames: ['Lipid Profile', 'TSH'],
          date: '2026-04-08', amountLkr: 4850, status: 'completed' },
        { id: 'r2', requestNumber: 'REQ-0819', testNames: ['Urine Culture'],
          date: '2026-04-06', amountLkr: 2200, status: 'processing' },
        { id: 'r3', requestNumber: 'REQ-0798', testNames: ['Full Blood Count'],
          date: '2026-04-02', amountLkr: 1500, status: 'cancelled' },
      ],
    };
  }
}