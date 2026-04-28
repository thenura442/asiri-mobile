import { Injectable, inject } from '@angular/core';
import { ApiService } from '../../../shared/services/api.service';
import { NotificationGroup, NotificationItem } from '../models/notifications.model';

@Injectable({ providedIn: 'root' })
export class CustomerNotificationsService {
  private api = inject(ApiService);

  async getNotifications(): Promise<NotificationGroup[]> {
    try {
      const res = await this.api.get<NotificationGroup[]>('/customer/notifications');
      return res.data;
    } catch { return this.mockGroups(); }
  }

  async markAllRead(): Promise<void> {
    await this.api.patch('/customer/notifications/read-all', {});
  }

  async markRead(id: string): Promise<void> {
    await this.api.patch(`/customer/notifications/${id}/read`, {});
  }

  unreadCount(groups: NotificationGroup[]): number {
    return groups.flatMap(g => g.items).filter(n => n.unread).length;
  }

  private mockGroups(): NotificationGroup[] {
    return [
      {
        label: 'Today',
        items: [
          { id: 'n1', type: 'booking',      title: 'Driver Assigned',    body: 'Kamal Samarasinghe has been assigned to your booking REQ-2026-0847. He will arrive in approximately 25 minutes.', time: '2 min ago',  timeIso: '2026-04-20T09:20:00Z', unread: true,  linkId: 'b1' },
          { id: 'n2', type: 'booking',      title: 'Booking Confirmed',  body: 'Your booking REQ-2026-0852 for Urine Culture & Sensitivity has been confirmed. Scheduled for 10:30 AM today.', time: '1 hr ago',   timeIso: '2026-04-20T08:30:00Z', unread: true,  linkId: 'b2' },
          { id: 'n3', type: 'report',       title: 'Report Ready',       body: 'Your Lipid Profile & TSH report (REQ-0831) is ready. Tap to view and download your results.', time: '3 hrs ago',  timeIso: '2026-04-20T06:00:00Z', unread: false, linkId: 'r1' },
        ],
      },
      {
        label: 'Yesterday',
        items: [
          { id: 'n4', type: 'booking',      title: 'Collection Complete', body: 'Sample collection for REQ-2026-0831 completed successfully. Your report will be ready within 4–6 hours.', time: 'Yesterday', timeIso: '2026-04-19T10:00:00Z', unread: false, linkId: 'b3' },
          { id: 'n5', type: 'cancellation', title: 'Booking Cancelled',   body: 'Booking REQ-2026-0798 was cancelled as per your request. Refund, if applicable, will be processed within 3–5 days.', time: 'Yesterday', timeIso: '2026-04-19T08:00:00Z', unread: false },
        ],
      },
      {
        label: 'Earlier',
        items: [
          { id: 'n6', type: 'report',  title: 'Report Ready',  body: 'Your Full Blood Count report (REQ-0781) is ready for download.', time: 'Mar 28', timeIso: '2026-03-28T14:00:00Z', unread: false, linkId: 'r3' },
          { id: 'n7', type: 'system', title: 'Scheduled Maintenance', body: 'Asiri Labs app will be briefly unavailable on Apr 5 from 2:00–3:00 AM for scheduled maintenance.', time: 'Apr 4', timeIso: '2026-04-04T10:00:00Z', unread: false },
        ],
      },
    ];
  }
}