import { Component, signal, inject } from '@angular/core';
import { Router } from '@angular/router';
import { DriverProfileService } from '../../services/driver-profile.service';
import { ToastService } from '../../../../shared/services/toast.service';
import { EmergencyCategory } from '../../models/driver-profile.model';

@Component({
  selector: 'app-emergency',
  standalone: true,
  imports: [],
  templateUrl: './emergency.component.html',
  styleUrls: ['./emergency.component.scss'],
})
export class EmergencyComponent {
  private profileService = inject(DriverProfileService);
  private toast          = inject(ToastService);
  private router         = inject(Router);

  selectedCategory = signal<EmergencyCategory>('Vehicle Breakdown');
  notes            = signal('');
  isLoading        = signal(false);
  submitted        = signal(false);

  readonly categories: { label: EmergencyCategory; iconId: string }[] = [
    { label: 'Vehicle Breakdown', iconId: 'car'      },
    { label: 'Traffic Accident',  iconId: 'alert'    },
    { label: 'Medical Emergency', iconId: 'medical'  },
    { label: 'Safety Concern',    iconId: 'shield'   },
    { label: 'Other',             iconId: 'info'     },
  ];

  selectCategory(c: EmergencyCategory): void { this.selectedCategory.set(c); }
  onNotes(val: string):   void { this.notes.set(val); }

  async onSend(): Promise<void> {
    this.isLoading.set(true);
    try {
      await this.profileService.sendEmergencyAlert({
        category: this.selectedCategory(),
        notes:    this.notes() || undefined,
        gpsLat:   6.9271,   // mock coords
        gpsLng:   79.8612,
      });
      this.submitted.set(true);
    } catch {
      await this.toast.showError('Failed to send alert. Please call your branch directly.');
    } finally {
      this.isLoading.set(false);
    }
  }

  onCancel(): void { this.router.navigate(['/driver/tabs/my-job']); }
}