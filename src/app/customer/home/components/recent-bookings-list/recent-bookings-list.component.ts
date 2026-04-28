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
    return booking.testNames.slice(0, 2).join(', ');
  }

  statusLabel(status: RecentBookingSummary['status']): string {
    return { completed: 'Done', processing: 'Processing', cancelled: 'Cancelled', active: 'Active' }[status];
  }
}