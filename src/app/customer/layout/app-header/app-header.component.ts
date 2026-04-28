import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-app-header',
  standalone: true,
  imports: [],
  templateUrl: './app-header.component.html',
  styleUrls: ['./app-header.component.scss'],
})
export class AppHeaderComponent {
  @Input() title     = '';
  @Input() showBack  = true;
  @Input() backLabel = '';

  @Output() backClick = new EventEmitter<void>();

  private location = inject(Location);

  onBack(): void {
    if (this.backClick.observed) {
      this.backClick.emit();
    } else {
      this.location.back();
    }
  }
}