import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { NavController } from '@ionic/angular/standalone';
import { FormsModule } from '@angular/forms';
import { IonContent } from '@ionic/angular/standalone';
import { ReportsService } from '../../services/reports.service';
import { ToastService } from '../../../../shared/services/toast.service';
import { ReportListItem, ReportFilter } from '../../models/reports.model';

@Component({
  selector: 'app-report-list',
  standalone: true,
  host: { class: 'ion-page' },
  imports: [IonContent, FormsModule],
  templateUrl: './report-list.component.html',
  styleUrls: ['./report-list.component.scss'],
})
export class ReportListComponent implements OnInit {
  private service = inject(ReportsService);
  private nav         = inject(NavController);
  private toast   = inject(ToastService);

  all          = signal<ReportListItem[]>([]);
  searchQuery  = signal('');
  activeFilter = signal<ReportFilter>('All');
  isLoading    = signal(true);

  readonly filters: ReportFilter[] = ['All', 'Ready', 'Processing'];

  latestReport = computed(() => this.all().find(r => r.status === 'ready') ?? null);

  listReports = computed(() => {
    const q = this.searchQuery().toLowerCase();
    const f = this.activeFilter();
    return this.all().filter(r => {
      const matchSearch = !q
        || r.testNames.some(t => t.toLowerCase().includes(q))
        || r.requestNumber.toLowerCase().includes(q);
      const matchFilter = f === 'All' || r.status.toLowerCase() === f.toLowerCase();
      return matchSearch && matchFilter;
    });
  });

  countFor(f: ReportFilter): number {
    if (f === 'All')        return this.all().length;
    if (f === 'Ready')      return this.all().filter(r => r.status === 'ready').length;
    if (f === 'Processing') return this.all().filter(r => r.status === 'processing').length;
    return 0;
  }

  async ngOnInit(): Promise<void> {
    const data = await this.service.getReports();
    this.all.set(data);
    this.isLoading.set(false);
  }

  openDetail(id: string): void {
    this.nav.navigateRoot(['/customer/tabs/reports/detail', id]);
  }

  async onDownload(id: string, event: Event): Promise<void> {
    event.stopPropagation();
    try {
      const url = await this.service.downloadReport(id);
      window.open(url, '_blank');
    } catch {
      await this.toast.showError('Report not available for download yet.');
    }
  }

  async onShare(id: string, event: Event): Promise<void> {
    event.stopPropagation();
    await this.toast.showWarning('Share feature coming soon.');
  }

  formatTests(r: ReportListItem): string {
    return r.testNames.slice(0, 2).join(', ');
  }
}