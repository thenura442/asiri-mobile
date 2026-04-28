export type DriverAlertType = 'job' | 'done' | 'cancellation' | 'warning' | 'system';

export interface DriverAlert {
  id:      string;
  type:    DriverAlertType;
  title:   string;
  body:    string;
  time:    string;
  timeIso: string;
  unread:  boolean;
  jobId?:  string;
}

export interface DriverAlertGroup {
  label: string;
  items: DriverAlert[];
}