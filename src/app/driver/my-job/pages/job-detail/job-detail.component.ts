import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IonContent } from '@ionic/angular/standalone';
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
  private route      = inject(ActivatedRoute);
  private router     = inject(Router);

  job       = signal<ActiveJob | null>(null);
  isLoading = signal(true);

  status = this.jobService.currentJobStatus;

  async ngOnInit(): Promise<void> {
    const data = await this.jobService.getActiveJob();
    this.job.set(data);
    this.isLoading.set(false);
  }

  statusLabel(): string {
    const map: Record<string, string> = {
      en_route: 'En Route', arrived: 'Arrived',
      collecting: 'Collecting', returning: 'Returning', delivered: 'Delivered',
    };
    return map[this.status()] ?? 'En Route';
  }

  formatPrice(n: number): string {
    return `Rs. ${n.toLocaleString('en-LK')}`;
  }

  goBack(): void { this.router.navigate(['/driver/tabs/my-job']); }
}