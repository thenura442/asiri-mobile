import { Component, OnInit, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { IonContent } from '@ionic/angular/standalone';
import { CustomerNotificationsService } from '../../services/customer-notifications.service';
import { NotificationGroup, NotificationItem, NotificationType } from '../../models/notifications.model';

@Component({
  selector: 'app-notification-list',
  standalone: true,
  imports: [IonContent],
  templateUrl: './notification-list.component.html',
  styleUrls: ['./notification-list.component.scss'],
})
export class NotificationListComponent implements OnInit {
  private service = inject(CustomerNotificationsService);
  private router  = inject(Router);

  groups    = signal<NotificationGroup[]>([]);
  isLoading = signal(true);

  unreadCount = () => this.service.unreadCount(this.groups());

  async ngOnInit(): Promise<void> {
    try {
      const data = await this.service.getNotifications();
      this.groups.set(data);
    } catch {
      // interceptor handles error toast
    } finally {
      this.isLoading.set(false);
    }
  }

  async markAllRead(): Promise<void> {
    try {
      await this.service.markAllRead();
      this.groups.update(gs => gs.map(g => ({
        ...g,
        items: g.items.map(n => ({ ...n, unread: false })),
      })));
    } catch {
      // interceptor handles error toast
    }
  }

  onTap(n: NotificationItem): void {
    if (n.linkId) {
      if (n.type === 'booking')      this.router.navigate(['/customer/my-bookings/detail', n.linkId]);
      if (n.type === 'report')       this.router.navigate(['/customer/reports/detail', n.linkId]);
      if (n.type === 'cancellation') this.router.navigate(['/customer/my-bookings/detail', n.linkId]);
    }
  }

  iconClass(type: NotificationType): string {
    return { booking: 'ico--booking', report: 'ico--report', cancellation: 'ico--cancel', system: 'ico--system' }[type];
  }

  cardClass(n: NotificationItem): string {
    return [n.unread ? 'card--unread' : '', `card--${n.type}`].filter(Boolean).join(' ');
  }
}