export type JobStatus =
  | 'en_route'
  | 'arrived'
  | 'collecting'
  | 'returning'
  | 'delivered';

export interface JobTest {
  id:         string;
  name:       string;
  code:       string;
  sampleType: 'blood' | 'urine';
  requiresRx: boolean;
}

export interface PatientInfo {
  id:                  string;
  initials:            string;
  fullName:            string;
  gender:              string;
  ageYears:            number;
  uhid:                string;
  phone:               string;
  flag:                'vip' | 'regular' | 'new';
  address:             string;
  landmark?:           string;
  specialInstructions?: string;
  pendingChargesLkr?:  number;
}

export interface VehicleInfo {
  plate:      string;
  model:      string;
  type:       string;
  branch:     string;
  branchPhone: string;
}

export interface PriceRow {
  label:     string;
  amountLkr: number;
}

export interface TimelineStep {
  title: string;
  time?: string;
  state: 'done' | 'active' | 'upcoming';
}

export interface ActiveJob {
  id:            string;
  requestNumber: string;
  status:        JobStatus;
  isUrgent:      boolean;
  scheduledAt:   string;   // display string
  patient:       PatientInfo;
  tests:         JobTest[];
  vehicle:       VehicleInfo;
  priceRows:     PriceRow[];
  totalLkr:      number;
  timeline:      TimelineStep[];
}

// Collection result per test
export type CollectionOutcome = 'pending' | 'collected' | 'failed';

export type FailReason =
  | 'Patient not prepared'
  | 'Insufficient sample'
  | 'Equipment issue'
  | 'Patient refused'
  | 'Other';

export interface TestCollectionResult {
  testId:    string;
  outcome:   CollectionOutcome;
  failReason?: FailReason;
  notes?:    string;
}