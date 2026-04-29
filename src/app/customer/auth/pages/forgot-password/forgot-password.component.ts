import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { IonContent } from '@ionic/angular/standalone';
import { NavController } from '@ionic/angular/standalone';
import { AuthService } from '../../../../shared/services/auth.service';
import { ToastService } from '../../../../shared/services/toast.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  host: { class: 'ion-page' },
  imports: [IonContent, ReactiveFormsModule],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
})
export class ForgotPasswordComponent {
  private auth  = inject(AuthService);
  private toast = inject(ToastService);
  private nav   = inject(NavController);

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
      const phone = this.method === 'phone'
        ? `+94${(v as { phone?: string }).phone}`
        : '';
      await this.auth.forgotPassword({
        method: this.method,
        phone:  this.method === 'phone' ? phone : undefined,
        email:  this.method === 'email' ? (v as { email?: string }).email : undefined,
      });
      await this.toast.showSuccess('Reset code sent!');
      this.nav.navigateRoot('/customer/auth/reset-password');
    } catch {
      // interceptor handles error toast
    } finally {
      this.isLoading = false;
    }
  }

  goBack(): void {
    this.nav.navigateRoot('/customer/auth/login');
  }
}