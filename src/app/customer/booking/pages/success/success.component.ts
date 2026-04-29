import { Component, OnInit, signal, inject } from '@angular/core';
import { IonContent } from '@ionic/angular/standalone';
import { BookingStateService } from '../../services/booking-state.service';
import { NavController } from '@ionic/angular/standalone';
  
interface ConfettiPiece {
  color:  string;
  left:   number;
  delay:  number;
  w:      number;
  h:      number;
  round:  boolean;
}

@Component({
  selector: 'app-success',
  standalone: true,
  host: { class: 'ion-page' },
  imports: [IonContent],
  templateUrl: './success.component.html',
  styleUrls: ['./success.component.scss'],
})
export class SuccessComponent implements OnInit {
  private booking = inject(BookingStateService);
  private nav     = inject(NavController);

  requestNumber = signal('');
  etaMinutes    = signal(0);

  readonly confetti: ConfettiPiece[] = [
    { color: '#3FBCB9', left: 15, delay: 0.1, w: 6,  h: 10, round: false },
    { color: '#002B4C', left: 30, delay: 0.3, w: 8,  h: 6,  round: true  },
    { color: '#6dd4d1', left: 50, delay: 0.15, w: 5, h: 12, round: false },
    { color: '#004575', left: 70, delay: 0.4, w: 10, h: 5,  round: false },
    { color: '#3FBCB9', left: 85, delay: 0.2, w: 7,  h: 7,  round: true  },
    { color: '#2d9e9b', left: 25, delay: 0.5, w: 6,  h: 9,  round: false },
    { color: '#002B4C', left: 60, delay: 0.25, w: 9, h: 6,  round: false },
    { color: '#6dd4d1', left: 40, delay: 0.35, w: 5, h: 5,  round: true  },
    { color: '#004575', left: 80, delay: 0.45, w: 8, h: 8,  round: false },
    { color: '#3FBCB9', left: 10, delay: 0.55, w: 6, h: 11, round: false },
  ];

  ngOnInit(): void {
    const state = history.state;
    this.requestNumber.set(state?.requestNumber ?? 'REQ-2026-' + Math.floor(Math.random() * 9000 + 1000));
    this.etaMinutes.set(state?.etaMinutes ?? 18);
  }

  onTrack(): void {
    this.nav.navigateRoot('/customer/tabs/bookings');
  }

  onHome(): void {
    this.nav.navigateRoot('/customer/tabs/home');
  }
}