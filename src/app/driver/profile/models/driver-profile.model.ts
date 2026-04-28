export interface DriverProfile {
  id:              string;
  initials:        string;
  fullName:        string;
  nic:             string;
  dateOfBirth:     string;
  phone:           string;
  licenseNumber:   string;
  licenseExpiry:   string;    // display string: "May 12, 2026"
  licenseExpiryDaysLeft: number;
  branchName:      string;
  branchType:      string;
  branchPhone:     string;
  managerName:     string;
  managerPhone:    string;
  isActive:        boolean;
}

export type EmergencyCategory =
  | 'Vehicle Breakdown'
  | 'Traffic Accident'
  | 'Medical Emergency'
  | 'Safety Concern'
  | 'Other';

export interface EmergencyAlertRequest {
  category:    EmergencyCategory;
  notes?:      string;
  gpsLat:      number;
  gpsLng:      number;
}