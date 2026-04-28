import { Injectable, inject } from '@angular/core';
import { ApiService } from '../../../shared/services/api.service';
import { ReportListItem, ReportDetail } from '../models/reports.model';

@Injectable({ providedIn: 'root' })
export class ReportsService {
  private api = inject(ApiService);

  async getReports(): Promise<ReportListItem[]> {
    try {
      const res = await this.api.get<ReportListItem[]>('/customer/reports');
      return res.data;
    } catch { return this.mockList(); }
  }

  async getDetail(id: string): Promise<ReportDetail> {
    try {
      const res = await this.api.get<ReportDetail>(`/customer/reports/${id}`);
      return res.data;
    } catch { return this.mockDetail(id); }
  }

  async downloadReport(id: string): Promise<string> {
    const res = await this.api.get<{ url: string }>(`/customer/reports/${id}/download`);
    return res.data.url;
  }

  private mockList(): ReportListItem[] {
    return [
      { id: 'r1', requestNumber: 'REQ-0831', testNames: ['Lipid Profile', 'TSH'],              dateDisplay: 'Apr 8',  branch: 'Asiri Central Lab',      status: 'ready'      },
      { id: 'r2', requestNumber: 'REQ-0805', testNames: ['Fasting Blood Sugar', 'HbA1c'],      dateDisplay: 'Apr 3',  branch: 'Asiri Narahenpita',       status: 'ready'      },
      { id: 'r3', requestNumber: 'REQ-0781', testNames: ['Full Blood Count'],                  dateDisplay: 'Mar 28', branch: 'Asiri Central Lab',       status: 'ready'      },
      { id: 'r4', requestNumber: 'REQ-0819', testNames: ['Urine Culture'],                     dateDisplay: 'Apr 6',  branch: 'Asiri Central Lab',       status: 'processing' },
      { id: 'r5', requestNumber: 'REQ-0847', testNames: ['FBC', 'HbA1c', 'Lipid Profile'],    dateDisplay: 'Today',  branch: 'Asiri Central Lab',       status: 'processing' },
      { id: 'r6', requestNumber: 'REQ-0756', testNames: ['Thyroid Panel (TSH, T3, T4)'],      dateDisplay: 'Mar 20', branch: 'Asiri Narahenpita',       status: 'ready'      },
      { id: 'r7', requestNumber: 'REQ-0732', testNames: ['Urine Routine & Microscopy'],        dateDisplay: 'Mar 15', branch: 'Asiri Central Lab',       status: 'ready'      },
    ];
  }

  private mockDetail(id: string): ReportDetail {
    return {
      id, requestNumber: 'REQ-2026-0831', dateDisplay: 'Apr 8, 2026',
      branch: 'Asiri Central Lab', status: 'ready',
      patientName: 'Kavindi Perera', patientAge: '28', patientGender: 'Female',
      collectedAt: '08 Apr 2026, 09:32', reportedAt: '08 Apr 2026, 14:15',
      sections: [
        {
          title: 'Lipid Profile Results',
          results: [
            { testName: 'Total Cholesterol', value: '185', unit: 'mg/dL', range: 'Desirable: <200', flag: 'normal' },
            { testName: 'LDL Cholesterol',   value: '168', unit: 'mg/dL', range: 'Optimal: <100',   flag: 'high'   },
            { testName: 'HDL Cholesterol',   value: '38',  unit: 'mg/dL', range: 'Desirable: >60',  flag: 'low'    },
            { testName: 'Triglycerides',      value: '142', unit: 'mg/dL', range: 'Normal: <150',    flag: 'normal' },
          ],
        },
        {
          title: 'TSH Result',
          results: [
            { testName: 'TSH (Thyroid)', value: '2.4', unit: 'mIU/L', range: 'Normal: 0.4–4.0', flag: 'normal' },
          ],
        },
      ],
    };
  }
}