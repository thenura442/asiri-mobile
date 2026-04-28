import { Injectable, inject } from '@angular/core';
import { ApiService } from '../../../shared/services/api.service';
import { HistoryJob, HistoryStats } from '../models/history.model';

@Injectable({ providedIn: 'root' })
export class HistoryService {
  private api = inject(ApiService);

  async getHistory(): Promise<HistoryJob[]> {
    try {
      const res = await this.api.get<HistoryJob[]>('/driver/history');
      return res.data;
    } catch { return this.mockHistory(); }
  }

  async getStats(): Promise<HistoryStats> {
    try {
      const res = await this.api.get<HistoryStats>('/driver/history/stats');
      return res.data;
    } catch { return { today: 3, thisWeek: 18, thisMonth: 72 }; }
  }

  private mockHistory(): HistoryJob[] {
    return [
      { id: 'h1', requestNumber: 'REQ-0847', patientName: 'Kavindi Perera',       testCount: 3, dateDisplay: 'Today',     dateIso: '2026-04-20', outcome: 'completed' },
      { id: 'h2', requestNumber: 'REQ-0845', patientName: 'Ruwan Jayasekara',     testCount: 2, dateDisplay: 'Today',     dateIso: '2026-04-20', outcome: 'completed' },
      { id: 'h3', requestNumber: 'REQ-0842', patientName: 'Nilantha Silva',       testCount: 1, dateDisplay: 'Today',     dateIso: '2026-04-20', outcome: 'failed'    },
      { id: 'h4', requestNumber: 'REQ-0839', patientName: 'Amali Fernando',       testCount: 4, dateDisplay: 'Yesterday', dateIso: '2026-04-19', outcome: 'completed' },
      { id: 'h5', requestNumber: 'REQ-0836', patientName: 'Dinesh Kumara',        testCount: 2, dateDisplay: 'Yesterday', dateIso: '2026-04-19', outcome: 'cancelled' },
      { id: 'h6', requestNumber: 'REQ-0831', patientName: 'Priya Wickramasinghe', testCount: 2, dateDisplay: 'Apr 10',    dateIso: '2026-04-10', outcome: 'completed' },
      { id: 'h7', requestNumber: 'REQ-0828', patientName: 'Sanjay Rathnayake',    testCount: 1, dateDisplay: 'Apr 9',     dateIso: '2026-04-09', outcome: 'completed' },
    ];
  }
}