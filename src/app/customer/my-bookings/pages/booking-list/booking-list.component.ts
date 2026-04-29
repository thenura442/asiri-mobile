import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { IonContent, NavController } from '@ionic/angular/standalone';
import { MyBookingsService } from '../../services/my-bookings.service';
import { BookingListItem, FilterTab, BookingStatus } from '../../models/my-bookings.model';

@Component({
  selector: 'app-booking-list',
  standalone: true,
  host: { class: 'ion-page' },
  imports: [IonContent],
  templateUrl: './booking-list.component.html',
  styleUrls: ['./booking-list.component.scss'],
})
export class BookingListComponent implements OnInit {
  private service = inject(MyBookingsService);
  private nav     = inject(NavController);

  all        = signal<BookingListItem[]>([]);
  activeTab  = signal<FilterTab>('All');
  isLoading  = signal(true);

  readonly tabs: FilterTab[] = ['All', 'Active', 'Completed', 'Cancelled'];

  private readonly ACTIVE_STATUSES: BookingStatus[] = [
    'en_route', 'pending', 'assigned', 'allocated', 'accepted', 'dispatched', 'arrived', 'collecting'
  ];
  private readonly COMPLETED_STATUSES: BookingStatus[] = ['completed', 'processing', 'collected'];
  private readonly CANCELLED_STATUSES: BookingStatus[] = ['cancelled'];

  filtered = computed(() => {
    const tab = this.activeTab();
    return this.all().filter(b => {
      if (tab === 'All')       return true;
      if (tab === 'Active')    return this.ACTIVE_STATUSES.includes(b.status);
      if (tab === 'Completed') return this.COMPLETED_STATUSES.includes(b.status);
      if (tab === 'Cancelled') return this.CANCELLED_STATUSES.includes(b.status);
      return true;
    });
  });

  countFor(tab: FilterTab): number {
    if (tab === 'All')       return this.all().length;
    if (tab === 'Active')    return this.all().filter(b => this.ACTIVE_STATUSES.includes(b.status)).length;
    if (tab === 'Completed') return this.all().filter(b => this.COMPLETED_STATUSES.includes(b.status)).length;
    if (tab === 'Cancelled') return this.all().filter(b => this.CANCELLED_STATUSES.includes(b.status)).length;
    return 0;
  }

  isActive(b: BookingListItem):  boolean { return this.ACTIVE_STATUSES.includes(b.status); }
  isEnRoute(b: BookingListItem): boolean { return b.status === 'en_route'; }

  statusClass(status: BookingStatus): string {
    const map: Record<BookingStatus, string> = {
      en_route:   'badge--enroute',
      pending:    'badge--pending',
      assigned:   'badge--pending',
      allocated:  'badge--pending',
      accepted:   'badge--pending',
      dispatched: 'badge--enroute',
      arrived:    'badge--enroute',
      collecting: 'badge--enroute',
      collected:  'badge--proc',
      processing: 'badge--proc',
      completed:  'badge--done',
      cancelled:  'badge--canc',
    };
    return map[status] ?? '';
  }

  statusLabel(status: BookingStatus): string {
    const map: Record<BookingStatus, string> = {
      en_route:   'En Route',
      pending:    'Pending',
      assigned:   'Assigned',
      allocated:  'badge--pending',
      accepted:   'badge--pending',
      dispatched: 'badge--enroute',
      arrived:    'Arrived',
      collecting: 'Collecting',
      collected:  'Collected',
      processing: 'Processing',
      completed:  'Completed',
      cancelled:  'Cancelled',
    };
    return map[status] ?? status;
  }

  displayTests(b: BookingListItem): string { return b.tests.slice(0, 2).join(', '); }
  extraTests(b: BookingListItem):   number  { return Math.max(0, b.tests.length - 2); }

  formatDate(iso: string): string {
    return new Date(iso).toLocaleDateString('en-LK', {
      month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  }

  formatPrice(p: number): string { return `Rs. ${p.toLocaleString('en-LK')}`; }

  async ngOnInit(): Promise<void> {
    try {
      const data = await this.service.getBookings();
      this.all.set(data);
    } catch {
      // interceptor handles error toast
    } finally {
      this.isLoading.set(false);
    }
  }

  setTab(tab: FilterTab): void { this.activeTab.set(tab); }

  openDetail(id: string): void {
    this.nav.navigateRoot(`/customer/my-bookings/detail/${id}`);
  }

  trackBooking(id: string, event: Event): void {
    event.stopPropagation();
    this.nav.navigateRoot(`/customer/my-bookings/tracking/${id}`);
  }

  onBookNew(): void {
    this.nav.navigateRoot('/customer/booking/select-tests');
  }
}