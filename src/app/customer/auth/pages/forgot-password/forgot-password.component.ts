import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { NgStyle } from '@angular/common';
import { IonContent } from '@ionic/angular/standalone';
import { AuthService } from '../../../../shared/services/auth.service';
import { ToastService } from '../../../../shared/services/toast.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [IonContent, ReactiveFormsModule, RouterLink, NgStyle],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
})
export class ForgotPasswordComponent {
  private auth   = inject(AuthService);
  private toast  = inject(ToastService);
  private router = inject(Router);

  method: 'phone' | 'email' = 'phone';
  isLoading = false;

  phoneForm = inject(FormBuilder).group({
    phone: ['', [Validators.required, Validators.pattern(/^7[0-9]{8}$/)]]
  });

  emailForm = inject(FormBuilder).group({
    email: ['', [Validators.required, Validators.email]]
  });

  switchMethod(m: 'phone' | 'email'): void { this.method = m; }

  async onSubmit(): Promise<void> {
    const form = this.method === 'phone' ? this.phoneForm : this.emailForm;
    if (form.invalid) { form.markAllAsTouched(); return; }
    this.isLoading = true;
    try {
      const v = form.value;
      await this.auth.forgotPassword({
        method: this.method,
        phone: this.method === 'phone' ? `+94${(v as {phone?:string}).phone}` : undefined,
        email: this.method === 'email' ? (v as {email?:string}).email : undefined,
      });
      await this.toast.showSuccess('Reset code sent!');
      this.router.navigate(['/customer/auth/reset-password'], {
        state: {
          method: this.method,
          phone: this.method === 'phone' ? `+94${(v as {phone?:string}).phone}` : '',
        }
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to send reset code.';
      await this.toast.showError(msg);
    } finally {
      this.isLoading = false;
    }
  }

  goBack(): void { this.router.navigate(['/customer/auth/login']); }
}