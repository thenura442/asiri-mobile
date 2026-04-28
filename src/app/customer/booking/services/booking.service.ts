import { Injectable, inject } from '@angular/core';
import { ApiService } from '../../../shared/services/api.service';
import { BookingStateService } from './booking-state.service';
import { CreateBookingResponse, TimeSlot } from '../models/booking.model';

@Injectable({ providedIn: 'root' })
export class BookingService {
  private api   = inject(ApiService);
  private state = inject(BookingStateService);

  async getAvailableSlots(branchId: string, date: string): Promise<TimeSlot[]> {
    try {
      const res = await this.api.get<TimeSlot[]>(
        `/booking/available-slots?branchId=${branchId}&date=${date}`
      );
      return res.data;
    } catch {
      return this.mockSlots();
    }
  }

  async createBooking(): Promise<CreateBookingResponse> {
    const s = this.state;
    const payload = {
      tests:          s.selectedTests().map(t => t.id),
      prescriptionUrl: s.prescriptionUrl(),
      location:       s.location(),
      schedule:       s.schedule(),
    };
    const res = await this.api.post<CreateBookingResponse>('/booking/create', payload);
    return res.data;
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