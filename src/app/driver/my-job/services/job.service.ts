import { Injectable, inject, signal } from '@angular/core';
import { ApiService } from '../../../shared/services/api.service';
import { ActiveJob, JobStatus, TestCollectionResult } from '../models/job-model';

const FAIL_REASON_MAP: Record<string, string> = {
  'Patient not prepared': 'patient_not_home',
  'Insufficient sample':  'fasting_not_met',
  'Equipment issue':      'equipment_issue',
  'Patient refused':      'patient_refused',
  'Other':                'patient_not_home',
};

@Injectable({ providedIn: 'root' })
export class JobService {
  private api = inject(ApiService);

  currentJobStatus = signal<JobStatus>('en_route');

  async getActiveJob(): Promise<ActiveJob | null> {
    try {
      const res = await this.api.get<any>('/driver/active-job');  // ← fix endpoint
      const d   = res.data?.job;                                   // ← unwrap job object
      if (!d) return null;

      this.currentJobStatus.set(d.status as JobStatus);

      return {
        id:            d.id,
        requestNumber: d.requestNumber,
        status:        d.status,
        isUrgent:      d.urgency === 'urgent',
        scheduledAt:   d.scheduledAt
          ? new Date(d.scheduledAt).toLocaleString('en-LK', { hour: '2-digit', minute: '2-digit', month: 'short', day: 'numeric' })
          : 'ASAP',
        patient: {
          id:                  d.patient?.id ?? '',
          initials:            this.getInitials(d.patient?.fullName ?? ''),
          fullName:            d.patient?.fullName ?? '',
          gender:              d.patient?.gender ?? '',
          ageYears:            d.patient?.age ?? 0,
          uhid:                d.patient?.uhid ?? '',
          phone:               d.patient?.phone ?? '',
          flag:                d.patient?.flag ?? 'regular',
          address:             d.address ?? d.patient?.address ?? '',
          landmark:            d.patient?.landmark ?? undefined,
          specialInstructions: d.patient?.specialInstructions ?? undefined,
          pendingChargesLkr:   d.patient?.pendingCharges
            ? Number(d.patient.pendingCharges)
            : undefined,
        },
        tests: (d.tests ?? []).map((t: any) => ({
          id:         t.id,
          name:       t.test?.name ?? '',
          code:       t.test?.code ?? '',
          sampleType: t.test?.sampleType ?? 'blood',
          requiresRx: t.test?.prescriptionReq ?? false,
        })),
        vehicle: {
          plate:       d.vehicle?.plateNumber ?? '—',
          model:       d.vehicle?.makeModel   ?? '—',
          type:        d.vehicle?.vehicleType ?? '—',
          branch:      d.branch?.name         ?? '—',
          branchPhone: d.branch?.phone        ?? '—',
        },
        priceRows: [
          { label: 'Base Fee',      amountLkr: Number(d.basePrice    ?? 0) },
          { label: 'Transport Fee', amountLkr: Number(d.transportFee ?? 0) },
        ],
        totalLkr:  Number(d.totalPrice ?? 0),
        timeline: (d.timeline ?? []).map((t: any) => ({
          title: t.title,
          time:  t.timestamp
            ? new Date(t.timestamp).toLocaleTimeString('en-LK', { hour: '2-digit', minute: '2-digit' })
            : undefined,
          state: t.status === 'done'   ? 'done'
              : t.status === 'active' ? 'active'
              : 'upcoming',
        })),
      };
    } catch {
      return this.mockJob();
    }
  }

  async getJobDetail(jobId: string): Promise<ActiveJob | null> {
    try {
      const res = await this.api.get<any>(`/driver/jobs/${jobId}`);
      const d   = res.data ?? res;
      if (!d) return null;

      return {
        id:            d.id,
        requestNumber: d.requestNumber,
        status:        d.status,
        isUrgent:      d.urgency === 'urgent',
        scheduledAt:   d.scheduledAt
          ? new Date(d.scheduledAt).toLocaleString('en-LK', { hour: '2-digit', minute: '2-digit', month: 'short', day: 'numeric' })
          : 'ASAP',
        patient: {
          id:                  d.patient?.id ?? '',
          initials:            this.getInitials(d.patient?.fullName ?? ''),
          fullName:            d.patient?.fullName ?? '',
          gender:              d.patient?.gender ?? '',
          ageYears:            d.patient?.age ?? 0,
          uhid:                d.patient?.uhid ?? '',
          phone:               d.patient?.phone ?? '',
          flag:                d.patient?.flag ?? 'regular',
          address:             d.address ?? d.patient?.address ?? '',
          landmark:            d.patient?.landmark ?? undefined,
          specialInstructions: d.patient?.specialInstructions ?? undefined,
          pendingChargesLkr:   d.patient?.pendingCharges ? Number(d.patient.pendingCharges) : undefined,
        },
        tests: (d.tests ?? []).map((t: any) => ({
          id:         t.id,
          name:       t.test?.name ?? '',
          code:       t.test?.code ?? '',
          sampleType: t.test?.sampleType ?? 'blood',
          requiresRx: t.test?.prescriptionReq ?? false,
        })),
        vehicle: {
          plate:       d.vehicle?.plateNumber ?? '—',
          model:       d.vehicle?.makeModel   ?? '—',
          type:        d.vehicle?.vehicleType ?? '—',
          branch:      d.branch?.name         ?? '—',
          branchPhone: d.branch?.phone        ?? '—',
        },
        priceRows: [
          { label: 'Base Fee',      amountLkr: Number(d.basePrice    ?? 0) },
          { label: 'Transport Fee', amountLkr: Number(d.transportFee ?? 0) },
        ],
        totalLkr: Number(d.totalPrice ?? 0),
        timeline: (d.timeline ?? []).map((t: any) => ({
          title: t.title,
          time:  t.timestamp
            ? new Date(t.timestamp).toLocaleTimeString('en-LK', { hour: '2-digit', minute: '2-digit' })
            : undefined,
          state: t.status === 'done'   ? 'done'
              : t.status === 'active' ? 'active'
              : 'upcoming',
        })),
      };
    } catch {
      return null;
    }
  }

  async advanceStatus(jobId: string, newStatus: JobStatus): Promise<void> {
    this.currentJobStatus.set(newStatus);
    try {
      await this.api.patch(`/driver/jobs/${jobId}/status`, { status: newStatus });
    } catch {
      // keep optimistic for demo
    }
  }

  async submitCollection(jobId: string, results: TestCollectionResult[]): Promise<void> {
    await this.api.post(`/driver/jobs/${jobId}/collection`, {
      items: results.map(r => ({
        jobRequestTestId: r.testId,
        status:           r.outcome === 'collected' ? 'collected' : 'failed',
        failReason:       r.failReason ? FAIL_REASON_MAP[r.failReason] : undefined,
        notes:            r.notes ?? undefined,
      })),
    });
  }

  private getInitials(fullName: string): string {
    const parts = fullName.trim().split(' ');
    return parts.length >= 2
      ? `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
      : parts[0]?.[0]?.toUpperCase() ?? '?';
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
        { id: 't1', name: 'Full Blood Count',    code: 'FBC-001',    sampleType: 'blood', requiresRx: false },
        { id: 't2', name: 'Glycated Hemoglobin', code: 'HBA1C-002',  sampleType: 'blood', requiresRx: true  },
        { id: 't3', name: 'Lipid Profile',       code: 'LIP-003',    sampleType: 'blood', requiresRx: false },
      ],
      vehicle: {
        plate: 'WP CAB-4521', model: 'Toyota HiAce',
        type: 'Van', branch: 'Asiri Central Lab',
        branchPhone: '011 452 3456',
      },
      priceRows: [
        { label: 'Base Fee',      amountLkr: 2500 },
        { label: 'Transport Fee', amountLkr: 800  },
      ],
      totalLkr: 4645,
      timeline: [
        { title: 'Booking Confirmed',    time: '09:12 AM', state: 'done'     },
        { title: 'Branch Accepted',      time: '09:14 AM', state: 'done'     },
        { title: 'Team Assigned',        time: '09:16 AM', state: 'done'     },
        { title: 'Departed from Branch', time: '09:20 AM', state: 'done'     },
        { title: 'En Route to Patient',  time: '09:20 AM', state: 'active'   },
        { title: 'Arrived at Patient',                     state: 'upcoming' },
        { title: 'Sample Collection',                      state: 'upcoming' },
        { title: 'Returning to Centre',                    state: 'upcoming' },
        { title: 'Delivered to Lab',                       state: 'upcoming' },
      ],
    };
  }
}