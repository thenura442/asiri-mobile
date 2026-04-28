import { Component, OnInit, signal, inject, computed } from '@angular/core';
import { Router } from '@angular/router';
import { IonContent } from '@ionic/angular/standalone';
import { BookingStateService } from '../../services/booking-state.service';
import { BookingService } from '../../services/booking.service';
import { TimeSlot, BranchSummary, ScheduleMode } from '../../models/booking.model';

interface DateChip {
  iso:   string;
  dow:   string;
  day:   string;
  month: string;
}

@Component({
  selector: 'app-schedule',
  standalone: true,
  imports: [IonContent],
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss'],
})
export class ScheduleComponent implements OnInit {
  private bookingState = inject(BookingStateService);
  private bookingService = inject(BookingService);
  private router = inject(Router);

  scheduleMode = signal<ScheduleMode>('now');
  selectedDate = signal<string>('');
  selectedSlot = signal<string>('');
  slots        = signal<TimeSlot[]>([]);
  isLoading    = signal(false);

  readonly branch: BranchSummary = {
    id: 'b1', name: 'Asiri Central Lab',
    distKm: 2.3, etaMin: 18, totalMin: 35, traffic: 'Low',
  };

  readonly dateChips: DateChip[] = this.buildDateChips();

  ngOnInit(): void {
    this.selectedDate.set(this.dateChips[0].iso);
    this.loadSlots();
  }

  private buildDateChips(): DateChip[] {
    const chips: DateChip[] = [];
    const dows = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
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
    const s = await this.bookingService.getAvailableSlots(this.branch.id, this.selectedDate());
    this.slots.set(s);
    this.isLoading.set(false);
  }

  canContinue = computed(() => {
    if (this.scheduleMode() === 'now') return true;
    return !!this.selectedSlot();
  });

  onContinue(): void {
    this.bookingState.setSchedule({
      mode:     this.scheduleMode(),
      date:     this.scheduleMode() === 'scheduled' ? this.selectedDate() : undefined,
      timeSlot: this.scheduleMode() === 'scheduled' ? this.selectedSlot() : undefined,
      branch:   this.branch,
    });
    this.router.navigate(['/customer/booking/confirm']);
  }

  goBack(): void { this.router.navigate(['/customer/booking/location']); }
}