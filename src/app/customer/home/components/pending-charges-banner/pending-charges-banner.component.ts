import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-pending-charges-banner',
  standalone: true,
  imports: [],
  templateUrl: './pending-charges-banner.component.html',
  styleUrls: ['./pending-charges-banner.component.scss'],
})
export class PendingChargesBannerComponent {
  @Input() amount = 0;

  get formatted(): string {
    return `Rs. ${this.amount.toLocaleString('en-LK')}`;
  }
}