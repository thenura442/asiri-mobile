import { Component, Input, Output, EventEmitter } from '@angular/core';
import { RecentBookingSummary } from '../../models/home.model';

@Component({
  selector: 'app-recent-bookings-list',
  standalone: true,
  imports: [],
  templateUrl: './recent-bookings-list.component.html',
  styleUrls: ['./recent-bookings-list.component.scss'],
})
export class RecentBookingsListComponent {
  @Input() bookings: RecentBookingSummary[] = [];
  @Output() viewAll = new EventEmitter<void>();

  formatAmount(amount: number): string {
    return `Rs. ${amount.toLocaleString('en-LK')}`;
  }

  formatDate(iso: string): string {
    return new Date(iso).toLocaleDateString('en-LK', { month: 'short', day: 'numeric' });
  }

  displayTests(booking: RecentBookingSummary): string {
    return booking.tests.slice(0, 2).join(', ');
  }

  extraTests(booking: RecentBookingSummary): number {
    return Math.max(0, booking.tests.length - 2);
  }

  statusLabel(status: string): string {
    const map: Record<string, string> = {
      completed: 'Done',
      processing: 'Processing',
      cancelled: 'Cancelled',
      active: 'Active',
      en_route: 'En Route',
      arrived: 'Arrived',
      collecting: 'Collecting',
      collected: 'Collected',
    };
    return map[status] ?? status;
  }
}