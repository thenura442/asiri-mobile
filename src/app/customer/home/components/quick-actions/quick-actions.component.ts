import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-quick-actions',
  standalone: true,
  imports: [],
  templateUrl: './quick-actions.component.html',
  styleUrls: ['./quick-actions.component.scss'],
})
export class QuickActionsComponent {
  @Output() bookNow = new EventEmitter<void>();
}