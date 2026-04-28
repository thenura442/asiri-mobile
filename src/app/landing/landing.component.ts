import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { IonContent } from '@ionic/angular/standalone';
import { NgStyle } from '@angular/common';

interface Particle {
  left: number;
  bottom: number;
  dur: number;
  delay: number;
}

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [IonContent, NgStyle],
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss'],
})
export class LandingComponent {
  private router = new Router();

  constructor(private _router: Router) {
    this.router = _router;
  }

  readonly particles: Particle[] = [
    { left: 12, bottom: 20, dur: 4,   delay: 0   },
    { left: 28, bottom: 30, dur: 5,   delay: 0.8 },
    { left: 45, bottom: 10, dur: 4.5, delay: 0.3 },
    { left: 62, bottom: 25, dur: 5.5, delay: 1.2 },
    { left: 78, bottom: 15, dur: 4,   delay: 0.6 },
    { left: 35, bottom: 40, dur: 6,   delay: 1.8 },
    { left: 55, bottom: 35, dur: 4.8, delay: 0.4 },
    { left: 85, bottom: 45, dur: 5.2, delay: 1   },
    { left: 20, bottom: 50, dur: 5.8, delay: 1.5 },
    { left: 70, bottom: 5,  dur: 4.2, delay: 2   },
  ];

  particleStyle(p: Particle): { [key: string]: string } {
    return {
      left:      `${p.left}%`,
      bottom:    `${p.bottom}%`,
      '--dur':   `${p.dur}s`,
      '--delay': `${p.delay}s`,
    };
  }

  goToCustomer(): void {
    this.router.navigate(['/customer/auth/login']);
  }

  goToDriver(): void {
    this.router.navigate(['/driver/auth/login']);
  }
}