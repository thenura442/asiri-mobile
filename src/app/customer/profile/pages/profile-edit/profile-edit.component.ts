import { Component, OnInit, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { IonContent } from '@ionic/angular/standalone';
import { ProfileService } from '../../services/profile.service';
import { ToastService } from '../../../../shared/services/toast.service';
import { CustomerProfile } from '../../models/profile.model';
import { TitleCasePipe } from '@angular/common';

@Component({
  selector: 'app-profile-edit',
  standalone: true,
  imports: [IonContent, ReactiveFormsModule, TitleCasePipe],
  templateUrl: './profile-edit.component.html',
  styleUrls: ['./profile-edit.component.scss'],
})
export class ProfileEditComponent implements OnInit {
  private service = inject(ProfileService);
  private toast   = inject(ToastService);
  private router  = inject(Router);
  private fb      = inject(FormBuilder);

  profile   = signal<CustomerProfile | null>(null);
  isLoading = signal(false);

  form = this.fb.group({
    firstName:             ['', Validators.required],
    lastName:              ['', Validators.required],
    email:                 ['', Validators.email],
    address:               ['', Validators.required],
    city:                  ['', Validators.required],
    district:              [''],
    emergencyContactName:  [''],
    emergencyContactPhone: ['', Validators.pattern(/^7[0-9]{8}$/)],
    specialInstructions:   [''],
  });

  get initials(): string {
    const p = this.profile();
    if (!p) return '?';
    return `${p.firstName[0]}${p.lastName[0]}`.toUpperCase();
  }

  async ngOnInit(): Promise<void> {
    const p = await this.service.getProfile();
    this.profile.set(p);
    this.form.patchValue({
      firstName: p.firstName, lastName: p.lastName,
      email: p.email ?? '',
      address: p.address, city: p.city, district: p.district,
      emergencyContactName: p.emergencyContactName ?? '',
      emergencyContactPhone: p.emergencyContactPhone?.replace('+94', '') ?? '',
      specialInstructions: p.specialInstructions ?? '',
    });
  }

  async onSave(): Promise<void> {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.isLoading.set(true);
    try {
      await this.service.updateProfile(this.form.value as Partial<CustomerProfile>);
      await this.toast.showSuccess('Profile updated!');
      this.router.navigate(['/customer/tabs/profile']);
    } catch {
      await this.toast.showError('Failed to save. Please try again.');
    } finally {
      this.isLoading.set(false);
    }
  }

  goBack(): void { this.router.navigate(['/customer/tabs/profile']); }
}