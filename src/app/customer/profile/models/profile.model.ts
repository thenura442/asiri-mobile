export interface CustomerProfile {
  id:                    string;
  firstName:             string;
  lastName:              string;
  fullName:              string;
  phone:                 string;
  email:                 string | null;
  nic:                   string;
  dateOfBirth:           string;
  gender:                'male' | 'female' | 'other';
  bloodGroup:            string | null;
  address:               string;
  city:                  string;
  district:              string;
  emergencyContactName:  string | null;
  emergencyContactPhone: string | null;
  specialInstructions:   string | null;
  avatarUrl:             string | null;
  uhid:                  string;
  flag:                  'new' | 'regular' | 'vip' | 'blacklisted';
  totalBookings:         number;
  totalReports:          number;
  totalAmountLkr:        number;
}

export interface IssueCategory {
  id:    string;
  label: string;
  icon:  string; // SVG path snippet identifier
}

export interface ReportIssueRequest {
  bookingId?:          string;
  category:            string;
  description:         string;
  photoUrls:           string[];
}