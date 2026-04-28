import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IonContent } from '@ionic/angular/standalone';
import { ReportsService } from '../../services/reports.service';
import { ReportDetail } from '../../models/reports.model';

@Component({
  selector: 'app-report-detail',
  standalone: true,
  imports: [IonContent],
  templateUrl: './report-detail.component.html',
  styleUrls: ['./report-detail.component.scss'],
})
export class ReportDetailComponent implements OnInit {
  private service = inject(ReportsService);
  private route   = inject(ActivatedRoute);
  private router  = inject(Router);

  detail    = signal<ReportDetail | null>(null);
  isLoading = signal(true);

  async ngOnInit(): Promise<void> {
    const id = this.route.snapshot.paramMap.get('id') ?? '';
    const data = await this.service.getDetail(id);
    this.detail.set(data);
    this.isLoading.set(false);
  }

  flagColor(flag: 'normal' | 'high' | 'low'): string {
    return { normal: '#10b981', high: '#ef4444', low: '#eab308' }[flag];
  }

  valueColor(flag: 'normal' | 'high' | 'low'): string {
    return flag === 'normal' ? '#002B4C' : this.flagColor(flag);
  }

  onDownload(): void { /* In production: open PDF URL */ }
  onShare():    void { /* In production: Capacitor Share */ }
  goBack():     void { this.router.navigate(['/customer/tabs/reports']); }
}