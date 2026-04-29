export interface TestCatalogItem {
  id:              string;
  name:            string;
  code:            string;
  price:           number;
  sampleType:      'blood' | 'urine';
  turnaroundTime:  string | null;
  prescriptionReq: boolean;
  timeSensitivityHrs: number | null;
}

export interface SelectedTest extends TestCatalogItem {
  selected: boolean;
}

export interface LocationData {
  address:   string;
  city:      string;
  district:  string;
  lat:       number;
  lng:       number;
  label?:    string;   // e.g. "Home", "Office"
}

export interface BranchSummary {
  id:       string;
  name:     string;
  distKm:   number;
  etaMin:   number;
  totalMin: number;
  traffic:  'Low' | 'Medium' | 'High';
}

export type ScheduleMode = 'now' | 'scheduled';

export interface ScheduleData {
  mode:       ScheduleMode;
  date?:      string;       // ISO date: "2026-04-21"
  timeSlot?:  string;       // "09:00"
  branch:     BranchSummary;
}

export interface PriceBreakdown {
  testTotal:     number;
  transportFee:  number;
  discount?:     number;
  total:         number;
}

export interface BookingState {
  tests:         SelectedTest[];
  prescriptionUrl: string | null;
  location:      LocationData | null;
  schedule:      ScheduleData | null;
}

export interface CreateBookingResponse {
  bookingId:     string;
  requestNumber: string;
  etaMinutes:    number;
}

// Available time slots from backend
export interface TimeSlot {
  time:      string;    // "09:00"
  available: boolean;
}