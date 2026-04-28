export type ReportStatus = 'ready' | 'processing';

export type ReportFilter = 'All' | 'Ready' | 'Processing';

export interface ReportListItem {
  id:            string;
  requestNumber: string;
  testNames:     string[];
  dateDisplay:   string;
  branch:        string;
  status:        ReportStatus;
  pdfUrl?:       string;
}

export interface ReportResult {
  testName:    string;
  value:       string;
  unit:        string;
  range:       string;
  flag:        'normal' | 'high' | 'low';
}

export interface ReportDetail {
  id:            string;
  requestNumber: string;
  dateDisplay:   string;
  branch:        string;
  patientName:   string;
  patientAge:    string;
  patientGender: string;
  collectedAt:   string;
  reportedAt:    string;
  status:        ReportStatus;
  pdfUrl?:       string;
  sections: {
    title:   string;
    results: ReportResult[];
  }[];
}