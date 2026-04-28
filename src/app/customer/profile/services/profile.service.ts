import { Injectable, inject } from '@angular/core';
import { ApiService } from '../../../shared/services/api.service';
import { CustomerProfile, ReportIssueRequest } from '../models/profile.model';

@Injectable({ providedIn: 'root' })
export class ProfileService {
  private api = inject(ApiService);

  async getProfile(): Promise<CustomerProfile> {
    try {
      const res = await this.api.get<CustomerProfile>('/customer/profile');
      return res.data;
    } catch { return this.mockProfile(); }
  }

  async updateProfile(data: Partial<CustomerProfile>): Promise<CustomerProfile> {
    const res = await this.api.patch<CustomerProfile>('/customer/profile', data);
    return res.data;
  }

  async reportIssue(data: ReportIssueRequest): Promise<void> {
    await this.api.post('/customer/issues', data);
  }

  private mockProfile(): CustomerProfile {
    return {
      id: 'p1', firstName: 'Kavindi', lastName: 'Perera',
      fullName: 'Kavindi Perera', phone: '+94 77 123 4567',
      email: 'kavindi@email.com', nic: '200012345678',
      dateOfBirth: '2000-03-15', gender: 'female', bloodGroup: 'O+',
      address: '42/1, Flower Road', city: 'Colombo 07', district: 'Colombo',
      emergencyContactName: 'Dilini Perera', emergencyContactPhone: '+94 71 234 5678',
      specialInstructions: null, avatarUrl: null, uhid: 'ASR-0042',
      flag: 'regular', totalBookings: 12, totalReports: 7, totalAmountLkr: 45800,
    };
  }
}