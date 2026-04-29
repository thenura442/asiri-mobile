import { Injectable, inject } from '@angular/core';
import { ApiService } from '../../../shared/services/api.service';
import { NotificationGroup, NotificationItem, NotificationType } from '../models/notifications.model';

@Injectable({ providedIn: 'root' })
export class CustomerNotificationsService {
  private api = inject(ApiService);

  async getNotifications(): Promise<NotificationGroup[]> {
    try {
      const res = await this.api.get<any>('/customer/notifications');
      const items: NotificationItem[] = (res.data.notifications ?? []).map((n: any) => ({
        id:     n.id,
        type:   this.mapType(n.type),
        title:  n.title,
        body:   n.message,
        time:   this.formatTime(n.createdAt),
        timeIso: n.createdAt,
        unread:  !n.isRead,
        linkId:  n.jobRequestId ?? undefined,
      }));
      return this.groupByDate(items);
    } catch {
      return this.mockGroups();
    }
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

  private mapType(apiType: string): NotificationType {
    const map: Record<string, NotificationType> = {
      new_request:   'booking',
      job_completed: 'booking',
      system_alert:  'system',
      report_ready:  'report',
      cancellation:  'cancellation',
    };
    return map[apiType] ?? 'system';
  }

  private formatTime(iso: string): string {
    const diff = Date.now() - new Date(iso).getTime();
    const mins  = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days  = Math.floor(diff / 86400000);
    if (mins < 60)   return `${mins} min ago`;
    if (hours < 24)  return `${hours} hr${hours > 1 ? 's' : ''} ago`;
    if (days === 1)  return 'Yesterday';
    return new Date(iso).toLocaleDateString('en-LK', { month: 'short', day: 'numeric' });
  }

  private groupByDate(items: NotificationItem[]): NotificationGroup[] {
    const today     = new Date().toDateString();
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    const groups: Record<string, NotificationItem[]> = {
      Today: [], Yesterday: [], Earlier: [],
    };
    for (const item of items) {
      const d = new Date(item.timeIso).toDateString();
      if (d === today)     groups['Today'].push(item);
      else if (d === yesterday) groups['Yesterday'].push(item);
      else                 groups['Earlier'].push(item);
    }
    return Object.entries(groups)
      .filter(([, items]) => items.length > 0)
      .map(([label, items]) => ({ label, items }));
  }

  private mockGroups(): NotificationGroup[] {
    return [
      {
        label: 'Today',
        items: [
          { id: 'n1', type: 'booking',      title: 'Driver Assigned',    body: 'Kamal Samarasinghe has been assigned to your booking REQ-2026-0847.', time: '2 min ago',  timeIso: '2026-04-20T09:20:00Z', unread: true,  linkId: 'b1' },
          { id: 'n2', type: 'booking',      title: 'Booking Confirmed',  body: 'Your booking REQ-2026-0852 has been confirmed. Scheduled for 10:30 AM today.', time: '1 hr ago', timeIso: '2026-04-20T08:30:00Z', unread: true,  linkId: 'b2' },
          { id: 'n3', type: 'report',       title: 'Report Ready',       body: 'Your Lipid Profile & TSH report (REQ-0831) is ready to download.', time: '3 hrs ago', timeIso: '2026-04-20T06:00:00Z', unread: false, linkId: 'r1' },
        ],
      },
      {
        label: 'Yesterday',
        items: [
          { id: 'n4', type: 'booking',      title: 'Collection Complete', body: 'Sample collection for REQ-2026-0831 completed successfully.', time: 'Yesterday', timeIso: '2026-04-19T10:00:00Z', unread: false, linkId: 'b3' },
          { id: 'n5', type: 'cancellation', title: 'Booking Cancelled',   body: 'Booking REQ-2026-0798 was cancelled as per your request.', time: 'Yesterday', timeIso: '2026-04-19T08:00:00Z', unread: false },
        ],
      },
      {
        label: 'Earlier',
        items: [
          { id: 'n6', type: 'report', title: 'Report Ready',         body: 'Your Full Blood Count report (REQ-0781) is ready for download.', time: 'Mar 28', timeIso: '2026-03-28T14:00:00Z', unread: false, linkId: 'r3' },
          { id: 'n7', type: 'system', title: 'Scheduled Maintenance', body: 'App will be briefly unavailable on Apr 5 from 2:00–3:00 AM.', time: 'Apr 4', timeIso: '2026-04-04T10:00:00Z', unread: false },
        ],
      },
    ];
  }
}