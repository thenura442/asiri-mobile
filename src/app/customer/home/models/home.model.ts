export interface ActiveBookingCard {
  id:            string;
  requestNumber: string;
  status:        string;
  tests:         string[];
  testCount:     number;
  etaMinutes:    number | null;
  location:      string;
  driverName:    string | null;
}

export interface RecentBookingSummary {
  id:            string;
  requestNumber: string;
  tests:         string[];
  testCount:     number;
  date:          string;
  status:        string;
  totalPrice:    number;
}

export interface HomeStats {
  totalBookings:  number;
  totalReports:   number;
  activeBookings: number;
}

export interface CustomerHomeData {
  profile: {
    fullName:  string;
    firstName: string;
    avatarUrl: string | null;
  };
  stats:               HomeStats;
  pendingCharges:      number | null;
  pendingChargeReason: string | null;
  activeBooking:       ActiveBookingCard | null;
  recentBookings:      RecentBookingSummary[];
}