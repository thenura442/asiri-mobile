import { Component, OnInit, inject, signal } from '@angular/core';
import { IonContent, NavController } from '@ionic/angular/standalone';
import { ActivatedRoute } from '@angular/router';
import { JobService } from '../../services/job.service';
import { ActiveJob } from '../../models/job-model';
import { TitleCasePipe } from '@angular/common';

@Component({
  selector: 'app-job-detail',
  standalone: true,
  imports: [IonContent, TitleCasePipe],
  templateUrl: './job-detail.component.html',
  styleUrls: ['./job-detail.component.scss'],
})
export class JobDetailComponent implements OnInit {
  private jobService = inject(JobService);
  private nav        = inject(NavController);
  private route      = inject(ActivatedRoute);

  job       = signal<ActiveJob | null>(null);
  isLoading = signal(true);

  status = this.jobService.currentJobStatus;

  async ngOnInit(): Promise<void> {
    const id = this.route.snapshot.paramMap.get('id');
    try {
      if (id) {
        const data = await this.jobService.getJobDetail(id);
        this.job.set(data);
        if (data) this.jobService.currentJobStatus.set(data.status as any);
      }
    } catch {
      // interceptor handles error toast
    } finally {
      this.isLoading.set(false);
    }
  }

  statusLabel(): string {
    const map: Record<string, string> = {
      allocated:  'Allocated',
      dispatched: 'Dispatched',
      en_route:   'En Route',
      arrived:    'Arrived',
      collecting: 'Collecting',
      collected:  'Collected',
      returning:  'Returning',
      at_center:  'At Center',
    };
    return map[this.status()] ?? 'En Route';
  }

  formatPrice(n: number): string {
    return `Rs. ${n.toLocaleString('en-LK')}`;
  }

  goBack(): void {
    this.nav.back();
  }
}