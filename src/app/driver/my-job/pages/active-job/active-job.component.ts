import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { IonContent, NavController } from '@ionic/angular/standalone';
import { JobService } from '../../services/job.service';
import { ActiveJob, JobStatus, JobTest } from '../../models/job-model';
import { UpperCasePipe } from '@angular/common';

interface CtaConfig {
  label:   string;
  icon:    'check' | 'arrive' | 'collect' | 'return' | 'deliver';
  next:    JobStatus | null;
  primary: boolean;
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
  private nav        = inject(NavController);

  job       = signal<ActiveJob | null>(null);
  isLoading = signal(true);
  isOnline  = signal(true);

  status = this.jobService.currentJobStatus;

  ctaConfig = computed((): CtaConfig => {
    switch (this.status()) {
      case 'allocated':  return { label: 'Accept & Head Out',  icon: 'arrive',  next: 'dispatched', primary: true };
      case 'dispatched': return { label: "I'm En Route",       icon: 'arrive',  next: 'en_route',   primary: true };
      case 'en_route':   return { label: 'Arrived at Patient', icon: 'arrive',  next: 'arrived',    primary: true };
      case 'arrived':    return { label: 'Start Collection',   icon: 'collect', next: 'collecting', primary: true };
      case 'collecting': return { label: 'Return to Branch',   icon: 'return',  next: 'returning',  primary: true };
      case 'returning':  return { label: 'Deliver to Lab',     icon: 'deliver', next: 'at_center',  primary: true };
      case 'at_center':  return { label: 'Job Completed',      icon: 'check',   next: null,         primary: false };
      default:           return { label: 'Accept & Head Out',  icon: 'arrive',  next: 'dispatched', primary: true };
    }
  });

  statusLabel = computed(() => {
    const map: Record<JobStatus, string> = {
      allocated:  'Allocated',
      dispatched: 'Dispatched',
      en_route:   'En Route',
      arrived:    'Arrived',
      collecting: 'Collecting',
      collected:  'Collected',
      returning:  'Returning',
      at_center:  'At Center',
    };
    return map[this.status()] ?? 'Allocated';
  });

  async ngOnInit(): Promise<void> {
    try {
      const data = await this.jobService.getActiveJob();
      this.job.set(data);
    } catch {
      // interceptor handles error toast
    } finally {
      this.isLoading.set(false);
    }
  }

  toggleOnline(): void { this.isOnline.update(v => !v); }

  onNavigate(): void {
    const j = this.job();
    if (!j) return;
    const addr = encodeURIComponent(`${j.patient.address}, Sri Lanka`);
    window.open(`https://maps.google.com/?q=${addr}`, '_blank');
  }

  async onCtaAction(): Promise<void> {
    const j   = this.job();
    const cfg = this.ctaConfig();
    if (!j || !cfg.next) return;

    if (cfg.next === 'collecting') {
      this.nav.navigateRoot(`/driver/collection/${j.id}`);
      return;
    }
    await this.jobService.advanceStatus(j.id, cfg.next);
  }

  onJobDetail(): void {
    const j = this.job();
    if (j) this.nav.navigateRoot(`/driver/job/detail/${j.id}`);
  }

  onEmergency(): void {
    this.nav.navigateRoot('/driver/pushed/emergency');
  }

  sampleTypeLabel(t: JobTest): string {
    return t.sampleType === 'blood' ? 'Blood' : 'Urine';
  }

  formatPrice(n: number): string {
    return `Rs. ${n.toLocaleString('en-LK')}`;
  }
}