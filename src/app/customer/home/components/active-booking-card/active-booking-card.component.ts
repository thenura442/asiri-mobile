import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ActiveBookingCard } from '../../models/home.model';
import { TitleCasePipe } from '@angular/common';

@Component({
  selector: 'app-active-booking-card',
  standalone: true,
  imports: [TitleCasePipe],
  templateUrl: './active-booking-card.component.html',
  styleUrls: ['./active-booking-card.component.scss'],
})
export class ActiveBookingCardComponent {
  @Input() booking!: ActiveBookingCard;
  @Output() trackClick = new EventEmitter<void>();

  get displayTests(): string {
    const t = this.booking.tests;
    if (t.length <= 2) return t.join(', ');
    return t.slice(0, 2).join(', ');
  }

  get extraTests(): number {
    return Math.max(0, this.booking.tests.length - 2);
  }

  // Derive progress step from status string
  get progressStep(): number {
    const map: Record<string, number> = {
      accepted: 0, allocated: 0, dispatched: 0,
      en_route: 1,
      arrived: 2,
      collecting: 3,
      collected: 4, returning: 4, completed: 4,
    };
    return map[this.booking.status] ?? 0;
  }

  get progressItems(): { kind: 'dot' | 'line'; state: 'done' | 'active' | 'upcoming' }[] {
    const step = this.progressStep;
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
          state: i < step ? 'done' : 'upcoming',
        });
      }
    }
    return result;
  }
}