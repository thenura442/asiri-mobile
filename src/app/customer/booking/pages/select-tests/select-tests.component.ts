import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { IonContent } from '@ionic/angular/standalone';
import { TestCatalogService } from '../../services/test-catalog.service';
import { BookingStateService } from '../../services/booking-state.service';
import { SelectedTest } from '../../models/booking.model';
import { TitleCasePipe } from '@angular/common';

type CategoryFilter = 'All' | 'Blood' | 'Urine';

@Component({
  selector: 'app-select-tests',
  standalone: true,
  imports: [IonContent, FormsModule, TitleCasePipe],
  templateUrl: './select-tests.component.html',
  styleUrls: ['./select-tests.component.scss'],
})
export class SelectTestsComponent implements OnInit {
  private catalog = inject(TestCatalogService);
  private booking = inject(BookingStateService);
  private router  = inject(Router);

  allTests     = signal<SelectedTest[]>([]);
  searchQuery  = signal('');
  activeFilter = signal<CategoryFilter>('All');

  readonly filters: CategoryFilter[] = ['All', 'Blood', 'Urine'];

  filteredTests = computed(() => {
    const q = this.searchQuery().toLowerCase();
    const f = this.activeFilter();
    return this.allTests().filter(t => {
      const matchesSearch = !q || t.name.toLowerCase().includes(q) || t.code.toLowerCase().includes(q);
      const matchesFilter = f === 'All' || t.sampleType.toLowerCase() === f.toLowerCase();
      return matchesSearch && matchesFilter;
    });
  });

  hasRxTests = computed(() => this.allTests().some(t => t.requiresPrescription && t.selected));

  selectedCount = this.booking.selectedCount;
  totalPrice    = this.booking.totalPrice;

  async ngOnInit(): Promise<void> {
    const catalog = await this.catalog.getCatalog();
    const existing = this.booking.selectedTests().map(t => t.id);
    this.allTests.set(catalog.map(t => ({
      ...t,
      selected: existing.includes(t.id),
    })));
    // Sync state
    this.booking.setTests(this.allTests());
  }

  onSearch(query: string): void {
    this.searchQuery.set(query);
  }

  setFilter(f: CategoryFilter): void {
    this.activeFilter.set(f);
  }

  toggleTest(id: string): void {
    this.allTests.update(tests =>
      tests.map(t => t.id === id ? { ...t, selected: !t.selected } : t)
    );
    this.booking.setTests(this.allTests());
  }

  isSelected(id: string): boolean {
    return this.allTests().find(t => t.id === id)?.selected ?? false;
  }

  formatPrice(p: number): string {
    return `Rs. ${p.toLocaleString('en-LK')}`;
  }

  onContinue(): void {
    if (this.selectedCount() === 0) return;
    if (this.hasRxTests()) {
      this.router.navigate(['/customer/booking/prescription']);
    } else {
      this.router.navigate(['/customer/booking/location']);
    }
  }

  goBack(): void {
    this.router.navigate(['/customer/tabs/home']);
  }
}