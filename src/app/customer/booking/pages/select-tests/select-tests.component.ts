import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonContent } from '@ionic/angular/standalone';
import { NavController } from '@ionic/angular/standalone';
import { TestCatalogService } from '../../services/test-catalog.service';
import { BookingStateService } from '../../services/booking-state.service';
import { SelectedTest } from '../../models/booking.model';
import { TitleCasePipe } from '@angular/common';
import { ToastService } from '../../../../shared/services/toast.service';

type CategoryFilter = 'All' | 'Blood' | 'Urine';

@Component({
  selector: 'app-select-tests',
  standalone: true,
  host: { class: 'ion-page' },
  imports: [IonContent, FormsModule, TitleCasePipe],
  templateUrl: './select-tests.component.html',
  styleUrls: ['./select-tests.component.scss'],
})
export class SelectTestsComponent implements OnInit {
  private catalog = inject(TestCatalogService);
  private booking = inject(BookingStateService);
  private nav     = inject(NavController);
  private toast   = inject(ToastService);

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

  hasRxTests    = computed(() => this.allTests().some(t => t.prescriptionReq && t.selected));
  selectedCount = this.booking.selectedCount;
  totalPrice    = this.booking.totalPrice;
  priceBreakdown = this.booking.priceBreakdown;
  async ngOnInit(): Promise<void> {
    const catalog  = await this.catalog.getCatalog();
    const existing = this.booking.selectedTests().map(t => t.id);
    this.allTests.set(catalog.map(t => ({
      ...t,
      selected: existing.includes(t.id),
    })));
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
    console.log('hasRxTests:', this.hasRxTests());
    console.log('selected tests:', this.allTests().filter(t => t.selected));
  }

  isSelected(id: string): boolean {
    return this.allTests().find(t => t.id === id)?.selected ?? false;
  }

  formatPrice(p: number | string): string {
    const num = Number(p);
    return `Rs. ${num.toLocaleString('en-US')}`;
  }

  async onContinue(): Promise<void> {
    if (this.selectedCount() === 0) {
      await this.toast.showError('Please select at least one test.');
      return;
    }
    if (this.hasRxTests()) {
      this.nav.navigateRoot('/customer/booking/prescription');
    } else {
      this.nav.navigateRoot('/customer/booking/location');
    }
  }

  goBack(): void {
    this.nav.navigateRoot('/customer/tabs/home');
  }
}