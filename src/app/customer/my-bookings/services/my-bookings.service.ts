import { Injectable, inject } from '@angular/core';
import { ApiService } from '../../../shared/services/api.service';
import { BookingListItem, BookingDetail, BookingStatus } from '../models/my-bookings.model';

@Injectable({ providedIn: 'root' })
export class MyBookingsService {
  private api = inject(ApiService);

  async getBookings(): Promise<BookingListItem[]> {
    try {
      const res = await this.api.get<any>('/customer/bookings');
      return res.data ?? [];
    } catch {
      return this.mockList();
    }
  }

  async getDetail(id: string): Promise<BookingDetail> {
    try {
      const res = await this.api.get<any>(`/customer/bookings/${id}`);
      return this.mapDetail(res.data);
    } catch {
      return this.mockDetail(id);
    }
  }

  async cancelBooking(id: string): Promise<void> {
    await this.api.post(`/customer/bookings/${id}/cancel`, {});
  }

  // ── Mappers ───────────────────────────────────────────────────────
  private mapListItem(b: any): BookingListItem {
    return {
      id:            b.id,
      requestNumber: b.requestNumber,
      status:        b.status as BookingStatus,
      tests:         (b.tests ?? []).map((t: any) => t.test?.name ?? ''),
      testCount:     b.tests?.length ?? 0,
      date:          b.createdAt,
      scheduledAt:   b.scheduledAt ?? null,
      location:      b.address ?? '',
      totalPrice:    Number(b.totalPrice ?? 0),
      etaMinutes:    b.etaMinutes ?? null,
      driverName:    b.driver?.fullName ?? null,
    };
  }

  private mapDetail(d: any): BookingDetail {
    const basePrice    = Number(d.basePrice    ?? 0);
    const distanceKm   = Number(d.distanceKm   ?? 0);
    const perKmRate    = Number(d.perKmRate    ?? 150);
    const transportFee = Number(d.transportFee ?? 0);
    const totalPrice   = Number(d.totalPrice   ?? 0);

    return {
      id:             d.id,
      requestNumber:  d.requestNumber,
      status:         d.status as BookingStatus,
      dateDisplay:    d.createdAt
        ? new Date(d.createdAt).toLocaleDateString('en-LK', {
            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
          })
        : '',
      etaMinutes:     d.etaMinutes ?? null,

      tests: (d.tests ?? []).map((t: any) => ({
        id:         t.id,
        name:       t.test?.name  ?? '',
        code:       t.test?.code  ?? '',
        sampleType: t.test?.sampleType ?? 'blood',
        status:     t.status ?? 'pending',
      })),

      timeline: (d.timeline ?? []).map((step: any) => ({
        title: step.title,
        time:  step.timestamp && step.status !== 'pending'
          ? new Date(step.timestamp).toLocaleTimeString('en-LK', {
              hour: '2-digit', minute: '2-digit'
            })
          : undefined,
        state: step.status === 'done'   ? 'done'
             : step.status === 'active' ? 'active'
             : 'upcoming',
      })),

      driver: d.driver ? {
        name:          d.driver.fullName ?? '',
        initials:      this.getInitials(d.driver.fullName ?? ''),
        vehicleModel:  d.vehicle?.makeModel   ?? d.vehicle?.plateNumber ?? '—',
        vehiclePlate:  d.vehicle?.plateNumber ?? '—',
        phone:         d.driver.phone ?? undefined,
      } : undefined,

      location:       d.address ?? '',
      locationDistKm: distanceKm,

      price: {
        baseLabel:    `Base (${d.tests?.length ?? 0} test${d.tests?.length !== 1 ? 's' : ''})`,
        baseAmount:   basePrice,
        distLabel:    `Distance (${distanceKm} km × Rs. ${perKmRate})`,
        distAmount:   distanceKm * perKmRate,
        transportFee: transportFee,
        total:        totalPrice,
      },
    };
  }

  private getInitials(fullName: string): string {
    const parts = fullName.trim().split(' ');
    return parts.length >= 2
      ? `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
      : parts[0]?.[0]?.toUpperCase() ?? '?';
  }

  // ── Mock data ─────────────────────────────────────────────────────
  private mockList(): BookingListItem[] {
    return [
      { id: 'b1', requestNumber: 'REQ-2026-0847', status: 'en_route',   tests: ['Full Blood Count', 'HbA1c', 'Lipid Profile'], testCount: 3, date: '2026-04-20T08:00:00.000Z', scheduledAt: null, location: 'Colombo 07', totalPrice: 4645, etaMinutes: 12,   driverName: 'Kamal S.' },
      { id: 'b2', requestNumber: 'REQ-2026-0852', status: 'pending',    tests: ['Urine Culture & Sensitivity'],                  testCount: 1, date: '2026-04-20T10:30:00.000Z', scheduledAt: null, location: 'Colombo 03', totalPrice: 2650, etaMinutes: null, driverName: null },
      { id: 'b3', requestNumber: 'REQ-2026-0831', status: 'completed',  tests: ['Lipid Profile', 'TSH'],                         testCount: 2, date: '2026-04-08T09:00:00.000Z', scheduledAt: null, location: 'Colombo 07', totalPrice: 4850, etaMinutes: null, driverName: null },
      { id: 'b4', requestNumber: 'REQ-2026-0819', status: 'processing', tests: ['Urine Culture'],                                 testCount: 1, date: '2026-04-06T07:30:00.000Z', scheduledAt: null, location: 'Colombo 07', totalPrice: 2200, etaMinutes: null, driverName: null },
      { id: 'b5', requestNumber: 'REQ-2026-0805', status: 'completed',  tests: ['Fasting Blood Sugar', 'HbA1c'],                 testCount: 2, date: '2026-04-03T08:30:00.000Z', scheduledAt: null, location: 'Nugegoda',    totalPrice: 3450, etaMinutes: null, driverName: null },
      { id: 'b6', requestNumber: 'REQ-2026-0798', status: 'cancelled',  tests: ['Full Blood Count'],                             testCount: 1, date: '2026-04-02T09:00:00.000Z', scheduledAt: null, location: 'Colombo 07', totalPrice: 1500, etaMinutes: null, driverName: null },
    ];
  }

  private mockDetail(id: string): BookingDetail {
    return {
      id, requestNumber: 'REQ-2026-0847', status: 'en_route',
      dateDisplay: 'Tuesday, April 20, 2026', etaMinutes: 12,
      tests: [
        { id: 't1', name: 'Full Blood Count', code: 'FBC-001', sampleType: 'blood', status: 'pending' },
        { id: 't2', name: 'HbA1c',            code: 'HBA-010', sampleType: 'blood', status: 'pending' },
        { id: 't3', name: 'Lipid Profile',    code: 'LIP-003', sampleType: 'blood', status: 'pending' },
      ],
      timeline: [
        { title: 'Booking Confirmed',   time: '09:12 AM', state: 'done'     },
        { title: 'Branch Accepted',     time: '09:14 AM', state: 'done'     },
        { title: 'Team Assigned',       time: '09:16 AM', state: 'done'     },
        { title: 'On the Way',          time: '09:20 AM', state: 'active'   },
        { title: 'Arrived at Location',                   state: 'upcoming' },
        { title: 'Sample Collection',                     state: 'upcoming' },
        { title: 'Lab Processing',                        state: 'upcoming' },
        { title: 'Report Ready',                          state: 'upcoming' },
      ],
      driver: { name: 'Kamal Samarasinghe', initials: 'KS', vehicleModel: 'Toyota HiAce', vehiclePlate: 'WP CAB-4521' },
      location: '42 Flower Road, Colombo 07', locationDistKm: 2.3,
      price: { baseLabel: 'Base (3 tests)', baseAmount: 7500, distLabel: 'Distance (2.3 km × Rs. 150)', distAmount: 345, transportFee: 0, total: 7845 },
    };
  }
}