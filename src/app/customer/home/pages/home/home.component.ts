import { Component, OnInit, inject, signal } from '@angular/core';
import { NavController } from '@ionic/angular/standalone';
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
  host: { class: 'ion-page' },
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
  private nav         = inject(NavController);

  homeData  = signal<CustomerHomeData | null>(null);
  isLoading = signal(true);
  sheetOpen = signal(false);

  get greeting(): string {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning,';
    if (h < 17) return 'Good afternoon,';
    return 'Good evening,';
  }

  ngOnInit(): void { this.loadData(); }

  private async loadData(): Promise<void> {
    try {
      const data = await this.homeService.getHomeData();
      this.homeData.set(data);
    } catch {
      this.homeData.set(this.mockData());
    } finally {
      this.isLoading.set(false);
    }
  }

  toggleSheet(): void { this.sheetOpen.update(v => !v); }

  onBookTest(): void {
    this.nav.navigateRoot('/customer/booking/select-tests');
  }

  onTrackBooking(id: string): void {
    this.nav.navigateRoot(`/customer/my-bookings/tracking/${id}`);
  }

  onViewAllBookings(): void {
    this.nav.navigateRoot('/customer/tabs/bookings');
  }

  onNotifications(): void {
    this.nav.navigateRoot('/customer/tabs/notifications');
  }

  private mockData(): CustomerHomeData {
    return {
      profile: { fullName: 'Kavindi Perera', firstName: 'Kavindi', avatarUrl: null },
      stats: { totalBookings: 12, totalReports: 7, activeBookings: 1 },
      pendingCharges: 450,
      pendingChargeReason: 'Late cancellation fee',
      activeBooking: {
        id:            'abc123',
        requestNumber: 'REQ-2026-0847',
        status:        'en_route',
        tests:         ['Full Blood Count', 'HbA1c', 'Lipid Profile'],
        testCount:     3,
        etaMinutes:    12,
        location:      'Colombo 07',
        driverName:    'Kamal S.',
      },
      recentBookings: [
        { id: 'r1', requestNumber: 'REQ-0831', tests: ['Lipid Profile', 'TSH'],
          testCount: 2, date: '2026-04-08T00:00:00.000Z', totalPrice: 4850, status: 'completed' },
        { id: 'r2', requestNumber: 'REQ-0819', tests: ['Urine Culture'],
          testCount: 1, date: '2026-04-06T00:00:00.000Z', totalPrice: 2200, status: 'processing' },
        { id: 'r3', requestNumber: 'REQ-0798', tests: ['Full Blood Count'],
          testCount: 1, date: '2026-04-02T00:00:00.000Z', totalPrice: 1500, status: 'cancelled' },
      ],
    };
  }
}