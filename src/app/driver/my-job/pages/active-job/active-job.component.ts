import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { IonContent } from '@ionic/angular/standalone';
import { JobService } from '../../services/job.service';
import { ActiveJob, JobStatus, JobTest } from '../../models/job-model';
import { UpperCasePipe } from '@angular/common';

interface CtaConfig {
  label:     string;
  icon:      'check' | 'arrive' | 'collect' | 'return' | 'deliver';
  next:      JobStatus | null;
  primary:   boolean;
}

@Component({
  selector: 'app-active-job',
  standalone: true,
  imports: [IonContent, UpperCasePipe],
  templateUrl: './active-job.component.html',
  styleUrls: ['./active-job.component.scss'],
})
export class ActiveJobComponent implements OnInit {
  private jobService = inject(JobService);
  private router     = inject(Router);

  job        = signal<ActiveJob | null>(null);
  isLoading  = signal(true);
  isOnline   = signal(true);

  // Local status mirrors service signal for reactive CTA
  status = this.jobService.currentJobStatus;

  ctaConfig = computed((): CtaConfig => {
    switch (this.status()) {
      case 'en_route':   return { label: 'Arrived at Patient',    icon: 'arrive',  next: 'arrived',    primary: false };
      case 'arrived':    return { label: 'Start Collection',       icon: 'collect', next: 'collecting', primary: false };
      case 'collecting': return { label: 'Return to Branch',       icon: 'return',  next: 'returning',  primary: false };
      case 'returning':  return { label: 'Deliver to Lab',         icon: 'deliver', next: 'delivered',  primary: false };
      case 'delivered':  return { label: 'Job Completed',          icon: 'check',   next: null,         primary: false };
      default:           return { label: 'Arrived at Patient',     icon: 'arrive',  next: 'arrived',    primary: false };
    }
  });

  statusLabel = computed(() => {
    const map: Record<JobStatus, string> = {
      en_route: 'En Route', arrived: 'Arrived',
      collecting: 'Collecting', returning: 'Returning', delivered: 'Delivered',
    };
    return map[this.status()] ?? 'En Route';
  });

  async ngOnInit(): Promise<void> {
    const data = await this.jobService.getActiveJob();
    this.job.set(data);
    this.isLoading.set(false);
  }

  toggleOnline(): void {
    this.isOnline.update(v => !v);
  }

  onNavigate(): void {
    const j = this.job();
    if (!j) return;
    // In production: deep-link to Google Maps / Apple Maps
    const addr = encodeURIComponent(`${j.patient.address}, Sri Lanka`);
    window.open(`https://maps.google.com/?q=${addr}`, '_blank');
  }

  async onCtaAction(): Promise<void> {
    const j = this.job();
    const cfg = this.ctaConfig();
    if (!j || !cfg.next) return;

    if (cfg.next === 'collecting') {
      // Navigate to collection checklist
      this.router.navigate(['/driver/collection', j.id]);
      return;
    }
    await this.jobService.advanceStatus(j.id, cfg.next);
  }

  onJobDetail(): void {
    const j = this.job();
    if (j) this.router.navigate(['/driver/job/detail', j.id]);
  }

  onEmergency(): void {
    this.router.navigate(['/driver/tabs/profile']); // D10 Emergency — wired in 6B
  }

  sampleTypeLabel(t: JobTest): string {
    return t.sampleType === 'blood' ? 'Blood' : 'Urine';
  }

  formatPrice(n: number): string {
    return `Rs. ${n.toLocaleString('en-LK')}`;
  }
}