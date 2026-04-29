import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular/standalone';
import { IonContent } from '@ionic/angular/standalone';
import { ReportsService } from '../../services/reports.service';
import { ToastService } from '../../../../shared/services/toast.service';
import { LoadingService } from '../../../../shared/services/loading.service';
import { ReportDetail } from '../../models/reports.model';

@Component({
  selector: 'app-report-detail',
  standalone: true,
  host: { class: 'ion-page' },
  imports: [IonContent],
  templateUrl: './report-detail.component.html',
  styleUrls: ['./report-detail.component.scss'],
})
export class ReportDetailComponent implements OnInit {
  private service = inject(ReportsService);
  private route   = inject(ActivatedRoute);
  private nav     = inject(NavController);
  private toast   = inject(ToastService);
  private loading = inject(LoadingService);

  detail    = signal<ReportDetail | null>(null);
  isLoading = signal(true);

  async ngOnInit(): Promise<void> {
    try {
      const id = this.route.snapshot.paramMap.get('id') ?? '';
      const data = await this.service.getDetail(id);
      this.detail.set(data);
    } catch {
      await this.toast.showError('Could not load report. Please try again.');
    } finally {
      this.isLoading.set(false);
    }
  }

  flagColor(flag: 'normal' | 'high' | 'low'): string {
    return { normal: '#10b981', high: '#ef4444', low: '#eab308' }[flag];
  }

  valueColor(flag: 'normal' | 'high' | 'low'): string {
    return flag === 'normal' ? '#002B4C' : this.flagColor(flag);
  }

  hasStructuredResults(): boolean {
    return (this.detail()?.sections?.length ?? 0) > 0;
  }

  hasPerTestPdfs(): boolean {
    return this.detail()?.tests?.some(t => t.reportUrl) ?? false;
  }

  async onDownload(): Promise<void> {
    const d = this.detail();
    if (!d) return;
    await this.loading.show('Preparing download...');
    try {
      // Always call the endpoint — this triggers steps 20 & 21 on the backend
      const url = await this.service.downloadReport(d.id);
      window.open(url, '_blank');
    } catch {
      await this.toast.showError('Report not available for download yet.');
    } finally {
      await this.loading.hide();
    }
  }

  async onDownloadTest(_testId: string): Promise<void> {
    // Route through the same download endpoint so backend registers the download
    // and fires timeline steps 20 & 21
    await this.onDownload();
  }

  async onShare(): Promise<void> {
    await this.toast.showWarning('Share feature coming soon.');
  }

  goBack(): void {
    this.nav.navigateRoot(['/customer/tabs/reports']);
  }
}