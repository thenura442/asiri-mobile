import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ActiveBookingCard } from '../../models/home.model';

@Component({
  selector: 'app-active-booking-card',
  standalone: true,
  imports: [],
  templateUrl: './active-booking-card.component.html',
  styleUrls: ['./active-booking-card.component.scss'],
})
export class ActiveBookingCardComponent {
  @Input() booking!: ActiveBookingCard;
  @Output() trackClick = new EventEmitter<void>();

  // Display at most 2 test names, then "+N more"
  get displayTests(): string {
    const t = this.booking.tests;
    if (t.length <= 2) return t.join(', ');
    return `${t.slice(0, 2).join(', ')}`;
  }

  get extraTests(): number {
    return Math.max(0, this.booking.tests.length - 2);
  }

  // Progress dots: 5 stages represented by { type: 'dot'|'line', state: 'done'|'active'|'upcoming' }
  get progressItems(): { kind: 'dot' | 'line'; state: 'done' | 'active' | 'upcoming' }[] {
    const step = this.booking.progressStep;   // 0–4
    const stages = 5;
    const result: { kind: 'dot' | 'line'; state: 'done' | 'active' | 'upcoming' }[] = [];
    for (let i = 0; i < stages; i++) {
      result.push({
        kind: 'dot',
        state: i < step ? 'done' : i === step ? 'active' : 'upcoming',
      });
      if (i < stages - 1) {
        result.push({
          kind: 'line',
          state: i < step ? 'done' : i === step ? 'active' : 'upcoming',
        });
      }
    }
    return result;
  }
}