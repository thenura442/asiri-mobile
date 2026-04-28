import { Component, OnInit, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { IonContent } from '@ionic/angular/standalone';
import { ProfileService } from '../../services/profile.service';
import { ToastService } from '../../../../shared/services/toast.service';
import { MyBookingsService } from '../../../my-bookings/services/my-bookings.service';
import { BookingListItem } from '../../../my-bookings/models/my-bookings.model';

type Category = 'Test Results' | 'Driver/Staff' | 'Billing' | 'App Issue' | 'Other';

@Component({
  selector: 'app-report-issue',
  standalone: true,
  imports: [IonContent, ReactiveFormsModule],
  templateUrl: './report-issue.component.html',
  styleUrls: ['./report-issue.component.scss'],
})
export class ReportIssueComponent implements OnInit {
  private service  = inject(ProfileService);
  private bookSvc  = inject(MyBookingsService);
  private toast    = inject(ToastService);
  private router   = inject(Router);
  private fb       = inject(FormBuilder);

  bookings         = signal<BookingListItem[]>([]);
  selectedBooking  = signal<string | null>(null);
  selectedCategory = signal<Category | null>(null);
  isLoading        = signal(false);
  submitted        = signal(false);
  charCount        = signal(0);

  readonly categories: Category[] = ['Test Results', 'Driver/Staff', 'Billing', 'App Issue', 'Other'];

  form = this.fb.group({
    description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(500)]],
  });

  async ngOnInit(): Promise<void> {
    const data = await this.bookSvc.getBookings();
    this.bookings.set(data.slice(0, 4));
  }

  onDescriptionInput(event: Event): void {
    const val = (event.target as HTMLTextAreaElement).value;
    this.charCount.set(val.length);
  }

  async onSubmit(): Promise<void> {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    if (!this.selectedCategory()) {
      await this.toast.showError('Please select an issue category.');
      return;
    }
    this.isLoading.set(true);
    try {
      await this.service.reportIssue({
        bookingId:   this.selectedBooking() ?? undefined,
        category:    this.selectedCategory()!,
        description: this.form.value.description!,
        photoUrls:   [],
      });
      this.submitted.set(true);
    } catch {
      await this.toast.showError('Failed to submit. Please try again.');
    } finally {
      this.isLoading.set(false);
    }
  }

  selectBooking(id: string): void {
    this.selectedBooking.update(v => v === id ? null : id);
  }

  selectCategory(c: Category): void {
    this.selectedCategory.update(v => v === c ? null : c);
  }

  formatTests(b: BookingListItem): string {
    return b.testNames.slice(0, 2).join(', ');
  }

  goBack():  void { this.router.navigate(['/customer/tabs/profile']); }
  goHome():  void { this.router.navigate(['/customer/tabs/home'], { replaceUrl: true }); }
}