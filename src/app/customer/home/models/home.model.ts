// ── Progress stage for active booking tracking bar ────────────────────
export type BookingProgressStep = 0 | 1 | 2 | 3 | 4;
// 0=assigned, 1=en_route, 2=arrived, 3=collecting, 4=completed

export interface ActiveBookingCard {
  id:            string;
  requestNumber: string;
  statusLabel:   string;    // e.g. "En Route"
  tests:         string[];  // test names
  etaMinutes:    number;    // estimated arrival time
  location:      string;    // patient suburb/city
  driverName:    string;
  progressStep:  BookingProgressStep;
}

export interface RecentBookingSummary {
  id:            string;
  requestNumber: string;
  testNames:     string[];
  date:          string;    // ISO date string
  amountLkr:     number;
  status:        'completed' | 'processing' | 'cancelled' | 'active';
}

export interface HomeStats {
  totalBookings:  number;
  totalReports:   number;
  activeBookings: number;
}

export interface CustomerHomeData {
  profile: {
    fullName:   string;
    firstName:  string;
    avatarUrl:  string | null;
  };
  stats:          HomeStats;
  pendingCharges: number | null;    // null = no pending charges
  activeBooking:  ActiveBookingCard | null;
  recentBookings: RecentBookingSummary[];
}