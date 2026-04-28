import { Injectable, inject } from '@angular/core';
import { ApiService } from '../../../shared/services/api.service';
import { DriverAlertGroup, DriverAlert } from '../models/driver-notification.model';

@Injectable({ providedIn: 'root' })
export class DriverNotificationsService {
  private api = inject(ApiService);

  async getAlerts(): Promise<DriverAlertGroup[]> {
    try {
      const res = await this.api.get<DriverAlertGroup[]>('/driver/notifications');
      return res.data;
    } catch { return this.mockAlerts(); }
  }

  async markAllRead(): Promise<void> {
    await this.api.patch('/driver/notifications/read-all', {});
  }

  unreadCount(groups: DriverAlertGroup[]): number {
    return groups.flatMap(g => g.items).filter(n => n.unread).length;
  }

  private mockAlerts(): DriverAlertGroup[] {
    return [
      {
        label: 'Today',
        items: [
          { id: 'a1', type: 'job',     title: 'New job assigned',          body: 'REQ-2026-0852 assigned. Patient: Amali Fernando, Colombo 03. Scheduled for 10:30 AM.',              time: '10:15 AM', timeIso: '2026-04-20T10:15:00Z', unread: true,  jobId: 'j2' },
          { id: 'a2', type: 'done',    title: 'Job completed successfully', body: 'REQ-2026-0847 completed. 2 of 3 samples collected. Delivered to Asiri Central Lab.',               time: '9:55 AM',  timeIso: '2026-04-20T09:55:00Z', unread: true,  jobId: 'h1' },
          { id: 'a3', type: 'warning', title: 'License expiring soon',      body: 'Your driving license expires in 28 days. Contact your branch manager to update your documents.', time: '8:00 AM',  timeIso: '2026-04-20T08:00:00Z', unread: true  },
        ],
      },
      {
        label: 'Yesterday',
        items: [
          { id: 'a4', type: 'cancellation', title: 'Job cancelled by branch', body: 'REQ-2026-0840 cancelled. Reason: Customer requested rescheduling.',             time: '3:45 PM', timeIso: '2026-04-19T15:45:00Z', unread: false },
          { id: 'a5', type: 'done',          title: 'Job completed',           body: 'REQ-2026-0838 completed. All 4 samples collected successfully.',                  time: '11:20 AM', timeIso: '2026-04-19T11:20:00Z', unread: false },
        ],
      },
      {
        label: 'This Week',
        items: [
          { id: 'a6', type: 'system', title: 'App update available', body: 'Asiri Driver v1.1.0 includes improved GPS accuracy and faster status updates.', time: 'Apr 10, 9:00 AM', timeIso: '2026-04-10T09:00:00Z', unread: false },
        ],
      },
    ];
  }
}