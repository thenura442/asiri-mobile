import { Injectable, inject } from '@angular/core';
import { ApiService } from '../../../shared/services/api.service';
import { DriverAlertGroup, DriverAlert, DriverAlertType } from '../models/driver-notification.model';

@Injectable({ providedIn: 'root' })
export class DriverNotificationsService {
  private api = inject(ApiService);

  async getAlerts(): Promise<DriverAlertGroup[]> {
    try {
      const res = await this.api.get<any>('/driver/notifications');
      const items: DriverAlert[] = (res.data.notifications ?? []).map((n: any) => ({
        id:      n.id,
        type:    this.mapType(n.type),
        title:   n.title,
        body:    n.message,
        time:    this.formatTime(n.createdAt),
        timeIso: n.createdAt,
        unread:  !n.isRead,
        jobId:   n.jobRequestId ?? undefined,
      }));
      return this.groupByDate(items);
    } catch {
      return this.mockAlerts();
    }
  }

  async markAllRead(): Promise<void> {
    await this.api.patch('/driver/notifications/read-all', {});
  }

  unreadCount(groups: DriverAlertGroup[]): number {
    return groups.flatMap(g => g.items).filter(n => n.unread).length;
  }

  private mapType(apiType: string): DriverAlertType {
    const map: Record<string, DriverAlertType> = {
      new_request:   'job',
      job_completed: 'done',
      system_alert:  'system',
      cancellation:  'cancellation',
    };
    return map[apiType] ?? 'system';
  }

  private formatTime(iso: string): string {
    const diff  = Date.now() - new Date(iso).getTime();
    const mins  = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days  = Math.floor(diff / 86400000);
    if (mins < 60)  return `${mins} min ago`;
    if (hours < 24) return `${hours} hr${hours > 1 ? 's' : ''} ago`;
    if (days === 1) return 'Yesterday';
    return new Date(iso).toLocaleDateString('en-LK', { month: 'short', day: 'numeric' });
  }

  private groupByDate(items: DriverAlert[]): DriverAlertGroup[] {
    const today     = new Date().toDateString();
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    const groups: Record<string, DriverAlert[]> = { Today: [], Yesterday: [], 'This Week': [] };
    for (const item of items) {
      const d = new Date(item.timeIso).toDateString();
      if (d === today)          groups['Today'].push(item);
      else if (d === yesterday) groups['Yesterday'].push(item);
      else                      groups['This Week'].push(item);
    }
    return Object.entries(groups)
      .filter(([, items]) => items.length > 0)
      .map(([label, items]) => ({ label, items }));
  }

  private mockAlerts(): DriverAlertGroup[] {
    return [
      {
        label: 'Today',
        items: [
          { id: 'a1', type: 'job',     title: 'New job assigned',          body: 'REQ-2026-0852 assigned. Patient: Amali Fernando, Colombo 03. Scheduled for 10:30 AM.', time: '10:15 AM', timeIso: '2026-04-20T10:15:00Z', unread: true,  jobId: 'j2' },
          { id: 'a2', type: 'done',    title: 'Job completed successfully', body: 'REQ-2026-0847 completed. 2 of 3 samples collected. Delivered to Asiri Central Lab.',  time: '9:55 AM',  timeIso: '2026-04-20T09:55:00Z', unread: true,  jobId: 'h1' },
          { id: 'a3', type: 'warning', title: 'License expiring soon',      body: 'Your driving license expires in 28 days. Contact your branch manager.',              time: '8:00 AM',  timeIso: '2026-04-20T08:00:00Z', unread: true  },
        ],
      },
      {
        label: 'Yesterday',
        items: [
          { id: 'a4', type: 'cancellation', title: 'Job cancelled by branch', body: 'REQ-2026-0840 cancelled. Reason: Customer requested rescheduling.', time: '3:45 PM',  timeIso: '2026-04-19T15:45:00Z', unread: false },
          { id: 'a5', type: 'done',         title: 'Job completed',           body: 'REQ-2026-0838 completed. All 4 samples collected successfully.',    time: '11:20 AM', timeIso: '2026-04-19T11:20:00Z', unread: false },
        ],
      },
      {
        label: 'This Week',
        items: [
          { id: 'a6', type: 'system', title: 'App update available', body: 'Asiri Driver v1.1.0 includes improved GPS accuracy and faster status updates.', time: 'Apr 10', timeIso: '2026-04-10T09:00:00Z', unread: false },
        ],
      },
    ];
  }
}