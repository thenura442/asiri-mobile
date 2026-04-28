import { Injectable, inject } from '@angular/core';
import { ApiService } from '../../../shared/services/api.service';
import { BookingListItem, BookingDetail, BookingStatus } from '../models/my-bookings.model';

@Injectable({ providedIn: 'root' })
export class MyBookingsService {
  private api = inject(ApiService);

  async getBookings(): Promise<BookingListItem[]> {
    try {
      const res = await this.api.get<BookingListItem[]>('/customer/bookings');
      return res.data;
    } catch {
      return this.mockList();
    }
  }

  async getDetail(id: string): Promise<BookingDetail> {
    try {
      const res = await this.api.get<BookingDetail>(`/booking/${id}`);
      return res.data;
    } catch {
      return this.mockDetail(id);
    }
  }

  async cancelBooking(id: string): Promise<void> {
    await this.api.post(`/booking/${id}/cancel`, {});
  }

  // ── Mock data ─────────────────────────────────────────────────────
  private mockList(): BookingListItem[] {
    return [
      { id: 'b1', requestNumber: 'REQ-2026-0847', status: 'en_route',   testNames: ['Full Blood Count', 'HbA1c', 'Lipid Profile'], dateDisplay: 'Today, 08:00 AM', dateIso: '2026-04-20', location: 'Colombo 07', amountLkr: 4645, etaMinutes: 12, driverName: 'Kamal S.' },
      { id: 'b2', requestNumber: 'REQ-2026-0852', status: 'pending',    testNames: ['Urine Culture & Sensitivity'],                  dateDisplay: 'Today, 10:30 AM', dateIso: '2026-04-20', location: 'Colombo 03', amountLkr: 2650 },
      { id: 'b3', requestNumber: 'REQ-2026-0831', status: 'completed',  testNames: ['Lipid Profile', 'TSH'],                         dateDisplay: 'Apr 8, 09:00 AM', dateIso: '2026-04-08', location: 'Colombo 07', amountLkr: 4850 },
      { id: 'b4', requestNumber: 'REQ-2026-0819', status: 'processing', testNames: ['Urine Culture'],                                 dateDisplay: 'Apr 6, 07:30 AM', dateIso: '2026-04-06', location: 'Colombo 07', amountLkr: 2200 },
      { id: 'b5', requestNumber: 'REQ-2026-0805', status: 'completed',  testNames: ['Fasting Blood Sugar', 'HbA1c'],                 dateDisplay: 'Apr 3, 08:30 AM', dateIso: '2026-04-03', location: 'Nugegoda',    amountLkr: 3450 },
      { id: 'b6', requestNumber: 'REQ-2026-0798', status: 'cancelled',  testNames: ['Full Blood Count'],                             dateDisplay: 'Apr 2, 09:00 AM', dateIso: '2026-04-02', location: 'Colombo 07', amountLkr: 1500 },
    ];
  }

  private mockDetail(id: string): BookingDetail {
    return {
      id, requestNumber: 'REQ-2026-0847', status: 'en_route',
      dateDisplay: 'Today, April 20, 2026', etaMinutes: 12,
      tests: [
        { id: 't1', name: 'Full Blood Count', code: 'FBC-001', sampleType: 'blood', status: 'pending' },
        { id: 't2', name: 'HbA1c',            code: 'HBA-010', sampleType: 'blood', status: 'pending' },
        { id: 't3', name: 'Lipid Profile',    code: 'LIP-003', sampleType: 'blood', status: 'pending' },
      ],
      timeline: [
        { title: 'Booking Confirmed', time: '09:12 AM', state: 'done'     },
        { title: 'Branch Accepted',   time: '09:14 AM', state: 'done'     },
        { title: 'Team Assigned',     time: '09:16 AM', state: 'done'     },
        { title: 'On the Way',        time: '09:20 AM — Now', state: 'active'   },
        { title: 'Arrived at Location',                 state: 'upcoming' },
        { title: 'Sample Collection',                   state: 'upcoming' },
        { title: 'Lab Processing',                      state: 'upcoming' },
        { title: 'Report Ready',                        state: 'upcoming' },
      ],
      driver: { name: 'Kamal Samarasinghe', initials: 'KS', vehicleModel: 'Toyota HiAce', vehiclePlate: 'WP CAB-4521' },
      location: '42 Flower Road, Colombo 07', locationDistKm: 2.3,
      price: { baseLabel: 'Base (3 tests)', baseAmount: 7500, distLabel: 'Distance (2.3 km × Rs. 150)', distAmount: 345, transportFee: 0, total: 7845 },
    };
  }
}