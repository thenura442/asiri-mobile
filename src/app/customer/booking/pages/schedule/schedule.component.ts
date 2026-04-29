import { Component, OnInit, signal, inject, computed } from '@angular/core';
import { IonContent } from '@ionic/angular/standalone';
import { BookingStateService } from '../../services/booking-state.service';
import { BookingService } from '../../services/booking.service';
import { ToastService } from '../../../../shared/services/toast.service';
import { TimeSlot, BranchSummary, ScheduleMode } from '../../models/booking.model';
import { NavController } from '@ionic/angular/standalone';

interface DateChip {
  iso:   string;
  dow:   string;
  day:   string;
  month: string;
}

@Component({
  selector: 'app-schedule',
  standalone: true,
  host: { class: 'ion-page' },
  imports: [IonContent],
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss'],
})
export class ScheduleComponent implements OnInit {
  private bookingState   = inject(BookingStateService);
  private bookingService = inject(BookingService);
  private nav            = inject(NavController);
  private toast          = inject(ToastService);

  scheduleMode = signal<ScheduleMode>('now');
  selectedDate = signal<string>('');
  selectedSlot = signal<string>('');
  slots        = signal<TimeSlot[]>([]);
  isLoading    = signal(false);

  // Branch is now resolved from backend, not hardcoded
  branch = signal<BranchSummary>({
    id:       '',
    name:     'Finding nearest branch...',
    distKm:   0,
    etaMin:   0,
    totalMin: 0,
    traffic:  'Low',
  });

  readonly dateChips: DateChip[] = this.buildDateChips();

  async ngOnInit(): Promise<void> {
    this.selectedDate.set(this.dateChips[0].iso);
    await this.loadSlots();
  }

  private buildDateChips(): DateChip[] {
    const chips: DateChip[] = [];
    const dows   = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      chips.push({
        iso:   d.toISOString().split('T')[0],
        dow:   i === 0 ? 'Today' : dows[d.getDay()],
        day:   String(d.getDate()),
        month: months[d.getMonth()],
      });
    }
    return chips;
  }

  setMode(mode: ScheduleMode): void {
    this.scheduleMode.set(mode);
  }

  selectDate(iso: string): void {
    this.selectedDate.set(iso);
    this.selectedSlot.set('');
    this.loadSlots();
  }

  selectSlot(time: string): void {
    this.selectedSlot.set(time);
  }

  private async loadSlots(): Promise<void> {
    this.isLoading.set(true);
    try {
      const resolved = await this.bookingService.getAvailableSlotsForLocation(
        this.selectedDate()
      );
      this.branch.set(resolved.branch);
      this.slots.set(resolved.slots);
    } catch {
      this.slots.set([]);
    } finally {
      this.isLoading.set(false);
    }
  }

  canContinue = computed(() => {
    if (this.scheduleMode() === 'now') return true;
    return !!this.selectedSlot();
  });

  async onContinue(): Promise<void> {
    if (this.scheduleMode() === 'scheduled' && !this.selectedSlot()) {
      await this.toast.showError('Please select a time slot.');
      return;
    }
    this.bookingState.setSchedule({
      mode:     this.scheduleMode(),
      date:     this.scheduleMode() === 'scheduled' ? this.selectedDate() : undefined,
      timeSlot: this.scheduleMode() === 'scheduled' ? this.selectedSlot() : undefined,
      branch:   this.branch(),
    });
    this.nav.navigateRoot('/customer/booking/confirm');
  }

  goBack(): void {
    this.nav.navigateRoot('/customer/booking/location');
  }
}