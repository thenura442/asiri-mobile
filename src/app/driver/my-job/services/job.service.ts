import { Injectable, inject, signal } from '@angular/core';
import { ApiService } from '../../../shared/services/api.service';
import { ActiveJob, JobStatus, TestCollectionResult } from '../models/job-model';

@Injectable({ providedIn: 'root' })
export class JobService {
  private api = inject(ApiService);

  // Local signal for optimistic status updates
  currentJobStatus = signal<JobStatus>('en_route');

  async getActiveJob(): Promise<ActiveJob | null> {
    try {
      const res = await this.api.get<ActiveJob>('/driver/job/active');
      this.currentJobStatus.set(res.data.status);
      return res.data;
    } catch {
      return this.mockJob();
    }
  }

  async advanceStatus(jobId: string, newStatus: JobStatus): Promise<void> {
    this.currentJobStatus.set(newStatus);  // optimistic update
    try {
      await this.api.patch(`/driver/job/${jobId}/status`, { status: newStatus });
    } catch {
      // Keep optimistic update for demo; real app would rollback
    }
  }

  async submitCollection(jobId: string, results: TestCollectionResult[]): Promise<void> {
    await this.api.post(`/driver/job/${jobId}/collection`, { results });
  }

  private mockJob(): ActiveJob {
    return {
      id: 'j1',
      requestNumber: 'REQ-2026-0847',
      status: 'en_route',
      isUrgent: true,
      scheduledAt: 'Today, 09:30 AM',
      patient: {
        id: 'p1', initials: 'KP', fullName: 'Kavindi Perera',
        gender: 'Female', ageYears: 34, uhid: 'P-00472',
        phone: '+94 77 123 4567', flag: 'vip',
        address: '42/1, Flower Road, Colombo 07',
        landmark: 'Near Majestic City entrance',
        specialInstructions: 'Patient requires fasting samples — confirm patient has fasted before collecting blood.',
        pendingChargesLkr: 450,
      },
      tests: [
        { id: 't1', name: 'Full Blood Count',   code: 'FBC-001',    sampleType: 'blood', requiresRx: false },
        { id: 't2', name: 'Glycated Hemoglobin', code: 'HBA1C-002', sampleType: 'blood', requiresRx: true  },
        { id: 't3', name: 'Lipid Profile',       code: 'LIP-003',   sampleType: 'blood', requiresRx: false },
      ],
      vehicle: {
        plate: 'WP CAB-4521', model: 'Toyota HiAce',
        type: 'Van', branch: 'Asiri Central Lab',
        branchPhone: '011 452 3456',
      },
      priceRows: [
        { label: 'Base Fee',               amountLkr: 2500 },
        { label: 'Distance (4.6 km × Rs. 75)', amountLkr: 345  },
        { label: 'Transport Fee',          amountLkr: 800  },
        { label: 'Test Charges',           amountLkr: 1000 },
      ],
      totalLkr: 4645,
      timeline: [
        { title: 'Booking Confirmed',      time: '09:12 AM', state: 'done'     },
        { title: 'Branch Accepted',        time: '09:14 AM', state: 'done'     },
        { title: 'Team Assigned',          time: '09:16 AM', state: 'done'     },
        { title: 'Departed from Branch',   time: '09:20 AM', state: 'done'     },
        { title: 'En Route to Patient',    time: '09:20 AM — Now', state: 'active'   },
        { title: 'Arrived at Patient',                       state: 'upcoming' },
        { title: 'Sample Collection',                        state: 'upcoming' },
        { title: 'Returning to Centre',                      state: 'upcoming' },
        { title: 'Delivered to Lab',                         state: 'upcoming' },
      ],
    };
  }
}