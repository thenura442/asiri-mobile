import { Injectable, inject } from '@angular/core';
import { ApiService } from '../../../shared/services/api.service';
import { BookingStateService } from './booking-state.service';
import { CreateBookingResponse, TimeSlot, BranchSummary } from '../models/booking.model';

interface AvailableSlotResponse {
  branchId:    string;
  branchName:  string;
  distanceKm:  number;
  slots:       string[]; // ISO datetime strings e.g. "2026-04-29T09:00:00"
}

export interface ResolvedBranch {
  branch: BranchSummary;
  slots:  TimeSlot[];
}

@Injectable({ providedIn: 'root' })
export class BookingService {
  private api   = inject(ApiService);
  private state = inject(BookingStateService);

  async getAvailableSlotsForLocation(date: string): Promise<ResolvedBranch> {
    const location = this.state.location();
    if (!location) return this.mockResolvedBranch(date);

    try {
      const res = await this.api.get<AvailableSlotResponse[]>(
        `/booking/slots?latitude=${location.lat}&longitude=${location.lng}&date=${date}`
      );

      const data = res.data;
      if (!data || data.length === 0) return this.mockResolvedBranch(date);

      // Take closest branch (first in array — backend sorts by distance)
      const closest = data[0];

      const branch: BranchSummary = {
        id:       closest.branchId,
        name:     closest.branchName,
        distKm:   closest.distanceKm,
        etaMin:   Math.round(closest.distanceKm * 3),  // rough ETA estimate
        totalMin: Math.round(closest.distanceKm * 3) + 15,
        traffic:  'Low',
      };

      // Convert ISO datetime strings to display time slots
      const slots: TimeSlot[] = closest.slots.map(isoStr => ({
        time:      isoStr.substring(11, 16), // extract "HH:MM" from ISO
        available: true,
      }));

      return { branch, slots };
    } catch {
      return this.mockResolvedBranch(date);
    }
  }

  async createBooking(): Promise<CreateBookingResponse> {
    const s       = this.state;
    const loc     = s.location();
    const sched   = s.schedule();

    const payload = {
      testIds:         s.selectedTests().map(t => t.id),
      prescriptionUrl: s.prescriptionUrl() ?? undefined,
      address:         loc?.address ?? '',
      latitude:        loc?.lat ?? 0,
      longitude:       loc?.lng ?? 0,
      isScheduled:     sched?.mode === 'scheduled',
      scheduledAt:     sched?.mode === 'scheduled' && sched.date && sched.timeSlot
                         ? `${sched.date}T${sched.timeSlot}:00`
                         : undefined,
    };

    const res = await this.api.post<CreateBookingResponse>('/booking/create', payload);
    return res.data;
  }

  // ── Mock fallback ─────────────────────────────────────────────────
  private mockResolvedBranch(date: string): ResolvedBranch {
    return {
      branch: {
        id:       'mock-branch',
        name:     'Asiri Central Lab',
        distKm:   2.3,
        etaMin:   18,
        totalMin: 35,
        traffic:  'Low',
      },
      slots: this.mockSlots(),
    };
  }

  private mockSlots(): TimeSlot[] {
    return [
      { time: '07:30', available: true  },
      { time: '08:00', available: true  },
      { time: '08:30', available: false },
      { time: '09:00', available: true  },
      { time: '09:30', available: true  },
      { time: '10:00', available: true  },
      { time: '10:30', available: false },
      { time: '11:00', available: true  },
      { time: '11:30', available: true  },
      { time: '14:00', available: true  },
      { time: '14:30', available: true  },
      { time: '15:00', available: false },
    ];
  }
}