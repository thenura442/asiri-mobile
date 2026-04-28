export type HistoryOutcome = 'completed' | 'failed' | 'cancelled';

export type HistoryFilter = 'All' | 'Today' | 'This Week' | 'This Month';

export interface HistoryJob {
  id:            string;
  requestNumber: string;
  patientName:   string;
  testCount:     number;
  dateDisplay:   string;   // "Today", "Yesterday", "Apr 10"
  dateIso:       string;
  outcome:       HistoryOutcome;
}

export interface HistoryStats {
  today:     number;
  thisWeek:  number;
  thisMonth: number;
}