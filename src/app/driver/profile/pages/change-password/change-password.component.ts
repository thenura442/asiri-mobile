import { Component, signal, inject, computed } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { IonContent, NavController } from '@ionic/angular/standalone';
import { ApiService } from '../../../../shared/services/api.service';
import { ToastService } from '../../../../shared/services/toast.service';

interface PasswordRequirement {
  label: string;
  met:   boolean;
}

function passwordMatchValidator(g: AbstractControl): ValidationErrors | null {
  const np = g.get('newPassword')?.value ?? '';
  const cp = g.get('confirmPassword')?.value ?? '';
  return np && cp && np !== cp ? { mismatch: true } : null;
}

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [IonContent, ReactiveFormsModule],
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss'],
})
export class ChangePasswordComponent {
  private api   = inject(ApiService);
  private toast = inject(ToastService);
  private nav   = inject(NavController);
  private fb    = inject(FormBuilder);

  isLoading   = signal(false);
  showCurrent = signal(false);
  showNew     = signal(false);
  showConfirm = signal(false);

  form = this.fb.group({
    currentPassword: ['', Validators.required],
    newPassword:     ['', [Validators.required, Validators.minLength(8)]],
    confirmPassword: ['', Validators.required],
  }, { validators: passwordMatchValidator });

  get newPw(): string { return this.form.get('newPassword')?.value ?? ''; }

  requirements = computed((): PasswordRequirement[] => {
    const pw = this.newPw;
    return [
      { label: '8+ characters',    met: pw.length >= 8   },
      { label: 'Uppercase letter', met: /[A-Z]/.test(pw) },
      { label: 'Lowercase letter', met: /[a-z]/.test(pw) },
      { label: 'Number',           met: /[0-9]/.test(pw) },
    ];
  });

  strengthBars = computed((): boolean[] => {
    const count = this.requirements().filter(r => r.met).length;
    return [count >= 1, count >= 2, count >= 3, count >= 4];
  });

  strengthColor = computed((): string => {
    const count = this.requirements().filter(r => r.met).length;
    if (count <= 1) return '#ef4444';
    if (count <= 2) return '#eab308';
    if (count <= 3) return '#3FBCB9';
    return '#10b981';
  });

  // ── Toggle helpers (arrow functions not allowed in Angular templates) ──────
  toggleCurrent(): void { this.showCurrent.update(v => !v); }
  toggleNew():     void { this.showNew.update(v => !v); }
  toggleConfirm(): void { this.showConfirm.update(v => !v); }

  onNewPasswordInput(): void {
    this.form.get('newPassword')?.updateValueAndValidity({ emitEvent: false });
  }

  async onSubmit(): Promise<void> {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;
    this.isLoading.set(true);
    try {
      await this.api.post('/driver/change-password', {
        currentPassword: this.form.value.currentPassword,
        newPassword:     this.form.value.newPassword,
        confirmPassword: this.form.value.confirmPassword,
      });
      await this.toast.showSuccess('Password updated successfully!');
      this.nav.back();
    } catch {
      // interceptor handles error toast
    } finally {
      this.isLoading.set(false);
    }
  }

  goBack(): void { this.nav.back(); }
}