export type NotificationType = 'booking' | 'report' | 'cancellation' | 'system';

export interface NotificationItem {
  id:       string;
  type:     NotificationType;
  title:    string;
  body:     string;
  time:     string;   // display: "2 min ago", "Yesterday"
  timeIso:  string;
  unread:   boolean;
  linkId?:  string;   // booking or report id to navigate to
}

export interface NotificationGroup {
  label: string;   // "Today", "Yesterday", "Earlier"
  items: NotificationItem[];
}