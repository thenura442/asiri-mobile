import { Injectable, inject } from '@angular/core';
import { ApiService } from '../../../shared/services/api.service';
import { ReportListItem, ReportDetail } from '../models/reports.model';

@Injectable({ providedIn: 'root' })
export class ReportsService {
  private api = inject(ApiService);

  async getReports(): Promise<ReportListItem[]> {
    try {
      const res = await this.api.get<any[]>('/customer/reports');
      const list = Array.isArray(res) ? res : (res as any).data ?? [];
      return list.map((r: any) => ({
        id:            r.jobId ?? r.id,
        requestNumber: r.requestNumber,
        testNames:     r.tests?.map((t: any) => t.testName ?? t.test?.name ?? '') ?? [],
        dateDisplay:   r.completedAt
          ? new Date(r.completedAt).toLocaleDateString('en-LK', { month: 'short', day: 'numeric', year: 'numeric' })
          : '—',
        branch:        r.branch?.name ?? 'Asiri Laboratories',
        status:        r.tests?.some((t: any) => t.reportUrl) ? 'ready' as const : 'processing' as const,
        pdfUrl:        r.tests?.find((t: any) => t.reportUrl)?.reportUrl ?? undefined,
      }));
    } catch {
      return this.mockList();
    }
  }

  async getDetail(id: string): Promise<ReportDetail> {
    try {
      const res = await this.api.get<any>(`/customer/reports/${id}`);
      const r = (res as any).data ?? res;
      return {
        id:            r.jobId ?? r.id,
        requestNumber: r.requestNumber,
        dateDisplay:   r.completedAt
          ? new Date(r.completedAt).toLocaleDateString('en-LK', { month: 'long', day: 'numeric', year: 'numeric' })
          : '—',
        branch:        r.branch?.name ?? 'Asiri Laboratories',
        patientName:   r.patient?.fullName ?? '—',
        patientAge:    r.patient?.dateOfBirth
          ? String(new Date().getFullYear() - new Date(r.patient.dateOfBirth).getFullYear())
          : '—',
        patientGender: r.patient?.gender ?? '—',
        collectedAt:   r.collectedAt
          ? new Date(r.collectedAt).toLocaleString('en-LK')
          : '—',
        reportedAt:    r.completedAt
          ? new Date(r.completedAt).toLocaleString('en-LK')
          : '—',
        status:        r.tests?.some((t: any) => t.reportUrl) ? 'ready' as const : 'processing' as const,
        pdfUrl:        r.tests?.find((t: any) => t.reportUrl)?.reportUrl ?? undefined,
        tests:         r.tests?.map((t: any) => ({
          id:              t.id ?? t.testCode,
          name:            t.testName ?? '',
          code:            t.testCode ?? '',
          reportUrl:       t.reportUrl ?? null,
          isCriticalValue: t.isCriticalValue ?? false,
        })) ?? [],
        sections: [],
      };
    } catch {
      return this.mockDetail(id);
    }
  }

  async downloadReport(id: string): Promise<string> {
    try {
      const res = await this.api.get<any>(`/customer/reports/${id}/download`);
      const r = (res as any).data ?? res;
      // API returns same shape as getDetail — extract first available reportUrl
      const url = r.tests?.find((t: any) => t.reportUrl)?.reportUrl ?? null;
      if (!url) throw new Error('No report URL available');
      return url;
    } catch {
      throw new Error('Report not available for download yet.');
    }
  }

  private mockList(): ReportListItem[] {
    return [
      { id: 'r1', requestNumber: 'REQ-0831', testNames: ['Lipid Profile', 'TSH'],           dateDisplay: 'Apr 8, 2026',  branch: 'Asiri Central Lab', status: 'ready'      },
      { id: 'r2', requestNumber: 'REQ-0805', testNames: ['Fasting Blood Sugar', 'HbA1c'],   dateDisplay: 'Apr 3, 2026',  branch: 'Asiri Central Lab', status: 'ready'      },
      { id: 'r3', requestNumber: 'REQ-0781', testNames: ['Full Blood Count'],               dateDisplay: 'Mar 28, 2026', branch: 'Asiri Central Lab', status: 'ready'      },
      { id: 'r4', requestNumber: 'REQ-0819', testNames: ['Urine Culture'],                  dateDisplay: 'Apr 6, 2026',  branch: 'Asiri Central Lab', status: 'processing' },
      { id: 'r5', requestNumber: 'REQ-0847', testNames: ['FBC', 'HbA1c', 'Lipid Profile'], dateDisplay: 'Today',        branch: 'Asiri Central Lab', status: 'processing' },
    ];
  }

  private mockDetail(id: string): ReportDetail {
    return {
      id,
      requestNumber: 'REQ-2026-0831',
      dateDisplay:   'Apr 8, 2026',
      branch:        'Asiri Central Lab',
      patientName:   'Kavindi Perera',
      patientAge:    '28',
      patientGender: 'Female',
      collectedAt:   '08 Apr 2026, 09:32',
      reportedAt:    '08 Apr 2026, 14:15',
      status:        'ready',
      pdfUrl:        undefined,
      tests: [
        { id: 't1', name: 'Lipid Profile', code: 'LIP-003', reportUrl: null, isCriticalValue: false },
        { id: 't2', name: 'TSH',           code: 'TSH-005', reportUrl: null, isCriticalValue: false },
      ],
      sections: [
        {
          title: 'Lipid Profile Results',
          results: [
            { testName: 'Total Cholesterol', value: '185', unit: 'mg/dL', range: 'Desirable: <200', flag: 'normal' },
            { testName: 'LDL Cholesterol',   value: '168', unit: 'mg/dL', range: 'Optimal: <100',   flag: 'high'   },
            { testName: 'HDL Cholesterol',   value: '38',  unit: 'mg/dL', range: 'Desirable: >60',  flag: 'low'    },
            { testName: 'Triglycerides',     value: '142', unit: 'mg/dL', range: 'Normal: <150',     flag: 'normal' },
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