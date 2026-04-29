import { Injectable, signal, computed } from '@angular/core';
import {
  BookingState, SelectedTest, LocationData,
  ScheduleData, PriceBreakdown,
} from '../models/booking.model';

@Injectable({ providedIn: 'root' })
export class BookingStateService {

  private state = signal<BookingState>({
    tests:           [],
    prescriptionUrl: null,
    location:        null,
    schedule:        null,
  });

  // ── Computed read selectors ───────────────────────────────────────
  tests           = computed(() => this.state().tests);
  selectedTests   = computed(() => this.state().tests.filter(t => t.selected));
  location        = computed(() => this.state().location);
  schedule        = computed(() => this.state().schedule);
  prescriptionUrl = computed(() => this.state().prescriptionUrl);

  requiresPrescription = computed(() =>
    this.selectedTests().some(t => t.prescriptionReq)
  );

  priceBreakdown = computed((): PriceBreakdown => {
    const testTotal    = this.selectedTests().reduce((sum, t) => sum + Number(t.price), 0);
    const transportFee = 350;
    return { testTotal, transportFee, total: testTotal + transportFee };
  });

  selectedCount = computed(() => this.selectedTests().length);
  totalPrice    = computed(() => this.priceBreakdown().total);

  // ── Mutators ──────────────────────────────────────────────────────
  setTests(tests: SelectedTest[]): void {
    this.state.update(s => ({ ...s, tests }));
  }

  toggleTest(id: string): void {
    this.state.update(s => ({
      ...s,
      tests: s.tests.map(t => t.id === id ? { ...t, selected: !t.selected } : t),
    }));
  }

  setPrescription(url: string | null): void {
    this.state.update(s => ({ ...s, prescriptionUrl: url }));
  }

  setLocation(location: LocationData): void {
    this.state.update(s => ({ ...s, location }));
  }

  setSchedule(schedule: ScheduleData): void {
    this.state.update(s => ({ ...s, schedule }));
  }

  reset(): void {
    this.state.set({ tests: [], prescriptionUrl: null, location: null, schedule: null });
  }
}