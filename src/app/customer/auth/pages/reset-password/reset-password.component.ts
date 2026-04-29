import { Component, OnInit, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { IonContent } from '@ionic/angular/standalone';
import { NavController } from '@ionic/angular/standalone';
import { AuthService } from '../../../../shared/services/auth.service';
import { ToastService } from '../../../../shared/services/toast.service';

function passwordsMatch(g: AbstractControl): ValidationErrors | null {
  return g.get('newPassword')?.value !== g.get('confirmPassword')?.value
    ? { mismatch: true } : null;
}

@Component({
  selector: 'app-reset-password',
  standalone: true,
  host: { class: 'ion-page' },
  imports: [IonContent, ReactiveFormsModule],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
})
export class ResetPasswordComponent implements OnInit {
  private auth  = inject(AuthService);
  private toast = inject(ToastService);
  private nav   = inject(NavController);
  private fb    = inject(FormBuilder);

  phone     = '';
  isLoading = false;
  showNew   = false;
  showConf  = false;

  form = this.fb.group({
    newPassword:     ['', [Validators.required, Validators.minLength(8),
                           Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/)]],
    confirmPassword: ['', Validators.required],
  }, { validators: passwordsMatch });

  ngOnInit(): void {
    this.phone = history.state?.phone ?? '';
  }

  get pw():       string  { return this.form.get('newPassword')?.value ?? ''; }
  get req8():     boolean { return this.pw.length >= 8; }
  get reqUpper(): boolean { return /[A-Z]/.test(this.pw); }
  get reqLower(): boolean { return /[a-z]/.test(this.pw); }
  get reqNum():   boolean { return /[0-9]/.test(this.pw); }
  get strength(): number  { return [this.req8, this.reqUpper, this.reqLower, this.reqNum].filter(Boolean).length; }

  get strengthColor(): string {
    return ['transparent', '#ef4444', '#f59e0b', '#3FBCB9', '#10b981'][this.strength];
  }

  async onSubmit(): Promise<void> {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.isLoading = true;
    try {
      await this.auth.resetPassword({
        phone:       this.phone,
        code:        history.state?.code ?? '',
        newPassword: this.form.value.newPassword!,
      });
      await this.toast.showSuccess('Password reset successfully!');
      this.nav.navigateRoot('/customer/auth/login');
    } catch {
      // interceptor handles error toast
    } finally {
      this.isLoading = false;
    }
  }

  goBack(): void {
    this.nav.navigateRoot('/customer/auth/forgot-password');
  }
}