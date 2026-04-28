import { Component, Input, Output, EventEmitter } from '@angular/core';
import { HomeStats } from '../../models/home.model';

@Component({
  selector: 'app-greeting-header',
  standalone: true,
  imports: [],
  templateUrl: './greeting-header.component.html',
  styleUrls: ['./greeting-header.component.scss'],
})
export class GreetingHeaderComponent {
  @Input() greeting  = 'Good morning,';
  @Input() firstName = '';
  @Input() stats:    HomeStats = { totalBookings: 0, totalReports: 0, activeBookings: 0 };

  @Output() notificationsClick = new EventEmitter<void>();
}