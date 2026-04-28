export type BookingStatus =
  | 'en_route'
  | 'pending'
  | 'assigned'
  | 'arrived'
  | 'collecting'
  | 'collected'
  | 'processing'
  | 'completed'
  | 'cancelled';

export type FilterTab = 'All' | 'Active' | 'Completed' | 'Cancelled';

export interface BookingListItem {
  id:            string;
  requestNumber: string;
  status:        BookingStatus;
  testNames:     string[];
  dateDisplay:   string;   // "Today, 08:00 AM" or "Apr 8, 09:00 AM"
  dateIso:       string;
  location:      string;
  amountLkr:     number;
  etaMinutes?:   number;   // present only when en_route
  driverName?:   string;
}

export interface DetailTest {
  id:         string;
  name:       string;
  code:       string;
  sampleType: 'blood' | 'urine';
  status:     'pending' | 'collected' | 'failed';
}

export interface TimelineStep {
  title:  string;
  time?:  string;
  state:  'done' | 'active' | 'upcoming';
}

export interface DriverInfo {
  name:          string;
  initials:      string;
  vehicleModel:  string;
  vehiclePlate:  string;
  phone?:        string;
}

export interface DetailPriceBreakdown {
  baseLabel:    string;
  baseAmount:   number;
  distLabel:    string;
  distAmount:   number;
  transportFee: number;
  total:        number;
}

export interface BookingDetail {
  id:            string;
  requestNumber: string;
  status:        BookingStatus;
  dateDisplay:   string;
  tests:         DetailTest[];
  timeline:      TimelineStep[];
  driver?:       DriverInfo;
  location:      string;
  locationDistKm: number;
  price:         DetailPriceBreakdown;
  etaMinutes?:   number;
}