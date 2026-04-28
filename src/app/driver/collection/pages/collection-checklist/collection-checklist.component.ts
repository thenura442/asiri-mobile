import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { IonContent } from '@ionic/angular/standalone';
import { JobService } from '../../../my-job/services/job.service';
import { JobTest, TestCollectionResult, CollectionOutcome, FailReason } from '../../../my-job/models/job-model';
import { ToastService } from '../../../../shared/services/toast.service';
import { TitleCasePipe } from '@angular/common';

interface CollectionEntry {
  test:      JobTest;
  outcome:   CollectionOutcome;
  failReason: FailReason | '';
  notes:     string;
}

const FAIL_REASONS: FailReason[] = [
  'Patient not prepared',
  'Insufficient sample',
  'Equipment issue',
  'Patient refused',
  'Other',
];

@Component({
  selector: 'app-collection-checklist',
  standalone: true,
  imports: [IonContent, ReactiveFormsModule, TitleCasePipe],
  templateUrl: './collection-checklist.component.html',
  styleUrls: ['./collection-checklist.component.scss'],
})
export class CollectionChecklistComponent implements OnInit {
  private jobService = inject(JobService);
  private toast      = inject(ToastService);
  private route      = inject(ActivatedRoute);
  private router     = inject(Router);

  jobId       = '';
  patientName = signal('Kavindi Perera');
  requestNum  = signal('REQ-2026-0847');
  entries     = signal<CollectionEntry[]>([]);
  isLoading   = signal(false);

  readonly failReasons = FAIL_REASONS;

  collectedCount = computed(() =>
    this.entries().filter(e => e.outcome === 'collected').length
  );
  failedCount = computed(() =>
    this.entries().filter(e => e.outcome === 'failed').length
  );

  allDecided = computed(() =>
    this.entries().every(e => e.outcome !== 'pending')
  );

  async ngOnInit(): Promise<void> {
    this.jobId = this.route.snapshot.paramMap.get('id') ?? '';
    const job = await this.jobService.getActiveJob();
    if (job) {
      this.patientName.set(job.patient.fullName);
      this.requestNum.set(job.requestNumber);
      this.entries.set(job.tests.map(t => ({
        test: t,
        outcome: 'pending' as CollectionOutcome,
        failReason: '',
        notes: '',
      })));
    }
  }

  setOutcome(index: number, outcome: CollectionOutcome): void {
    this.entries.update(entries =>
      entries.map((e, i) =>
        i === index ? { ...e, outcome, failReason: outcome === 'collected' ? '' : e.failReason } : e
      )
    );
  }

  setFailReason(index: number, reason: FailReason | ''): void {
    this.entries.update(entries =>
      entries.map((e, i) => i === index ? { ...e, failReason: reason } : e)
    );
  }

  setNotes(index: number, notes: string): void {
    this.entries.update(entries =>
      entries.map((e, i) => i === index ? { ...e, notes } : e)
    );
  }

  async onConfirm(): Promise<void> {
    if (!this.allDecided()) {
      await this.toast.showError('Please mark each test as Collected or Failed.');
      return;
    }
    this.isLoading.set(true);
    try {
      const results: TestCollectionResult[] = this.entries().map(e => ({
        testId:    e.test.id,
        outcome:   e.outcome,
        failReason: e.outcome === 'failed' && e.failReason ? e.failReason : undefined,
        notes:     e.notes || undefined,
      }));
      await this.jobService.submitCollection(this.jobId, results);
      await this.jobService.advanceStatus(this.jobId, 'returning');
      await this.toast.showSuccess('Collection submitted successfully!');
      this.router.navigate(['/driver/tabs/my-job'], { replaceUrl: true });
    } catch {
      await this.toast.showError('Failed to submit. Please try again.');
    } finally {
      this.isLoading.set(false);
    }
  }

  goBack(): void { this.router.navigate(['/driver/tabs/my-job']); }
}