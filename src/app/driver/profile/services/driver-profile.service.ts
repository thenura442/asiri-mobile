import { Injectable, inject } from '@angular/core';
import { ApiService } from '../../../shared/services/api.service';
import { DriverProfile, EmergencyAlertRequest } from '../models/driver-profile.model';

@Injectable({ providedIn: 'root' })
export class DriverProfileService {
  private api = inject(ApiService);

  async getProfile(): Promise<DriverProfile> {
    try {
      const res = await this.api.get<any>('/driver/profile');
      const d   = res.data;
      const parts = (d.fullName ?? '').trim().split(' ');
      const initials = parts.length >= 2
        ? `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
        : parts[0]?.[0]?.toUpperCase() ?? '?';
      const expiry     = d.licenseExpiry ? new Date(d.licenseExpiry) : null;
      const daysLeft   = expiry ? Math.ceil((expiry.getTime() - Date.now()) / 86400000) : 999;
      const expiryDisp = expiry
        ? expiry.toLocaleDateString('en-LK', { month: 'short', day: 'numeric', year: 'numeric' })
        : '—';
      return {
        id:                    d.id,
        initials,
        fullName:              d.fullName,
        nic:                   d.nic,
        dateOfBirth:           d.dateOfBirth
          ? new Date(d.dateOfBirth).toLocaleDateString('en-LK', { day: 'numeric', month: 'long', year: 'numeric' })
          : '—',
        phone:                 d.phone,
        licenseNumber:         d.licenseNumber,
        licenseExpiry:         expiryDisp,
        licenseExpiryDaysLeft: daysLeft,
        branchName:            d.branch?.name ?? d.branchName ?? '—',
        branchType:            d.branch?.type ?? d.branchType ?? '—',
        branchPhone:           d.branch?.phone ?? d.branchPhone ?? '—',
        managerName:           d.branch?.managerName ?? d.managerName ?? '—',
        managerPhone:          d.branch?.managerPhone ?? d.managerPhone ?? '—',
        isActive:              d.status === 'active',
      };
    } catch {
      return this.mockProfile();
    }
  }

  async sendEmergencyAlert(req: EmergencyAlertRequest): Promise<void> {
    await this.api.post('/driver/emergency', req);
  }

  private mockProfile(): DriverProfile {
    return {
      id: 'd1', initials: 'KS', fullName: 'Kamal Samarasinghe',
      nic: '200012345678', dateOfBirth: '15 March 1990',
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