import { Component, signal, inject } from '@angular/core';
import { Router } from '@angular/router';
import { DriverProfileService } from '../../services/driver-profile.service';
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
  private router         = inject(Router);

  selectedCategory = signal<EmergencyCategory>('Vehicle Breakdown');
  notes            = signal('');
  isLoading        = signal(false);
  submitted        = signal(false);

  readonly categories: { label: EmergencyCategory; iconId: string }[] = [
    { label: 'Vehicle Breakdown', iconId: 'car'     },
    { label: 'Traffic Accident',  iconId: 'alert'   },
    { label: 'Medical Emergency', iconId: 'medical' },
    { label: 'Safety Concern',    iconId: 'shield'  },
    { label: 'Other',             iconId: 'info'    },
  ];

  private readonly categoryMap: Record<EmergencyCategory, string> = {
    'Vehicle Breakdown': 'vehicle_breakdown',
    'Traffic Accident':  'traffic_accident',
    'Medical Emergency': 'medical_emergency',
    'Safety Concern':    'safety_concern',
    'Other':             'other',
  };

  selectCategory(c: EmergencyCategory): void { this.selectedCategory.set(c); }
  onNotes(val: string): void { this.notes.set(val); }

  async onSend(): Promise<void> {
    this.isLoading.set(true);
    try {
      await this.profileService.sendEmergencyAlert({
        category: this.categoryMap[this.selectedCategory()] as any,
        notes:    this.notes() || undefined,
        gpsLat:   6.9271,
        gpsLng:   79.8612,
      });
      this.submitted.set(true);
    } catch {
      // interceptor handles error toast
    } finally {
      this.isLoading.set(false);
    }
  }

  onCancel(): void { this.router.navigate(['/driver/tabs/profile']); }
}