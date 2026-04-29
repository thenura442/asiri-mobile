import { Component, OnInit, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { DriverProfileService } from '../../services/driver-profile.service';
import { DriverProfile } from '../../models/driver-profile.model';

@Component({
  selector: 'app-contact-branch',
  standalone: true,
  imports: [],
  templateUrl: './contact-branch.component.html',
  styleUrls: ['./contact-branch.component.scss'],
})
export class ContactBranchComponent implements OnInit {
  private profileService = inject(DriverProfileService);
  private router         = inject(Router);

  profile = signal<DriverProfile | null>(null);

  async ngOnInit(): Promise<void> {
    try {
      const data = await this.profileService.getProfile();
      this.profile.set(data);
    } catch {
      // interceptor handles error toast
    }
  }

  onCall(phone: string): void {
    window.open(`tel:${phone.replace(/\s/g, '')}`, '_self');
  }

  onWhatsApp(phone: string): void {
    const clean = phone.replace(/[\s\-\+]/g, '').replace(/^0/, '94');
    window.open(`https://wa.me/${clean}`, '_blank');
  }

  onClose(): void {
    this.router.navigate(['/driver/tabs/profile']);
  }
}