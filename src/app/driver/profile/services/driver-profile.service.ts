import { Injectable, inject } from '@angular/core';
import { ApiService } from '../../../shared/services/api.service';
import { DriverProfile, EmergencyAlertRequest } from '../models/driver-profile.model';

@Injectable({ providedIn: 'root' })
export class DriverProfileService {
  private api = inject(ApiService);

  async getProfile(): Promise<DriverProfile> {
    try {
      const res = await this.api.get<DriverProfile>('/driver/profile');
      return res.data;
    } catch { return this.mockProfile(); }
  }

  async sendEmergencyAlert(req: EmergencyAlertRequest): Promise<void> {
    await this.api.post('/driver/emergency', req);
  }

  private mockProfile(): DriverProfile {
    return {
      id: 'd1', initials: 'KS', fullName: 'Kamal Samarasinghe',
      nic: '200012345678', dateOfBirth: '15 Mar 1990',
      phone: '+94 77 234 5678',
      licenseNumber: 'B-1234567', licenseExpiry: 'May 12, 2026',
      licenseExpiryDaysLeft: 28,
      branchName: 'Asiri Central Lab', branchType: 'Lab',
      branchPhone: '011 452 3456',
      managerName: 'Dr. Sanjay Perera', managerPhone: '077 234 5678',
      isActive: true,
    };
  }
}