import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { IonContent } from '@ionic/angular/standalone';
import { HistoryService } from '../../services/history.service';
import { HistoryJob, HistoryFilter, HistoryStats } from '../../models/history.model';

@Component({
  selector: 'app-job-history',
  standalone: true,
  imports: [IonContent],
  templateUrl: './job-history.component.html',
  styleUrls: ['./job-history.component.scss'],
})
export class JobHistoryComponent implements OnInit {
  private service = inject(HistoryService);

  all          = signal<HistoryJob[]>([]);
  stats        = signal<HistoryStats>({ today: 0, thisWeek: 0, thisMonth: 0 });
  activeFilter = signal<HistoryFilter>('All');
  isLoading    = signal(true);

  readonly filters: HistoryFilter[] = ['All', 'Today', 'This Week', 'This Month'];

  filtered = computed(() => {
    const f = this.activeFilter();
    if (f === 'All')        return this.all();
    if (f === 'Today')      return this.all().filter(j => j.dateDisplay === 'Today');
    if (f === 'This Week')  return this.all().filter(j =>
      ['Today', 'Yesterday'].includes(j.dateDisplay) || j.dateDisplay.startsWith('Apr'));
    return this.all();
  });

  async ngOnInit(): Promise<void> {
    try {
      const [jobs, stats] = await Promise.all([
        this.service.getHistory(),
        this.service.getStats(),
      ]);
      this.all.set(jobs);
      this.stats.set(stats);
    } catch {
      // interceptor handles error toast
    } finally {
      this.isLoading.set(false);
    }
  }

  outcomeClass(outcome: HistoryJob['outcome']): string {
    return { completed: 'job--done', failed: 'job--fail', cancelled: 'job--canc' }[outcome];
  }

  outcomeLabel(outcome: HistoryJob['outcome']): string {
    return { completed: 'Completed', failed: 'Failed', cancelled: 'Cancelled' }[outcome];
  }

  badgeClass(outcome: HistoryJob['outcome']): string {
    return { completed: 'badge--done', failed: 'badge--fail', cancelled: 'badge--canc' }[outcome];
  }
}