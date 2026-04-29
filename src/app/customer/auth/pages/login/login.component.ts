import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { NgStyle } from '@angular/common';
import { IonContent } from '@ionic/angular/standalone';
import { NavController } from '@ionic/angular/standalone';
import { AuthService } from '../../../../shared/services/auth.service';
import { ToastService } from '../../../../shared/services/toast.service';

interface Particle {
  left: number; bottom: number; d: number; dl: number;
}

@Component({
  selector: 'app-login',
  standalone: true,
  host: { class: 'ion-page' },
  imports: [IonContent, ReactiveFormsModule, NgStyle],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  private fb    = inject(FormBuilder);
  private auth  = inject(AuthService);
  private toast = inject(ToastService);
  private nav   = inject(NavController);

  form = this.fb.group({
    phone:      ['', [Validators.required, Validators.pattern(/^7[0-9]{8}$/)]],
    password:   ['', [Validators.required, Validators.minLength(8)]],
    rememberMe: [true],
  });

  showPassword = false;
  isLoading    = false;

  readonly particles: Particle[] = [
    { left: 10, bottom: 15, d: 4,   dl: 0   },
    { left: 30, bottom: 25, d: 5.2, dl: 0.7 },
    { left: 55, bottom: 10, d: 4.5, dl: 0.3 },
    { left: 75, bottom: 20, d: 5.8, dl: 1.1 },
    { left: 42, bottom: 40, d: 5.5, dl: 0.5 },
    { left: 88, bottom: 8,  d: 6,   dl: 1.8 },
  ];

  particleStyle(p: Particle): { [key: string]: string } {
    return {
      left:   `${p.left}%`,
      bottom: `${p.bottom}%`,
      '--d':  `${p.d}s`,
      '--dl': `${p.dl}s`,
    };
  }

  get phoneInvalid(): boolean {
    const c = this.form.get('phone');
    return !!(c?.invalid && c?.touched);
  }

  get passwordInvalid(): boolean {
    const c = this.form.get('password');
    return !!(c?.invalid && c?.touched);
  }

  get rememberMe(): boolean {
    return this.form.get('rememberMe')?.value ?? true;
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  toggleRemember(): void {
    const current = this.form.get('rememberMe')?.value;
    this.form.patchValue({ rememberMe: !current });
  }

  async onSubmit(): Promise<void> {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.isLoading = true;
    try {
      const { phone, password, rememberMe } = this.form.value;
      await this.auth.loginCustomer({
        phone:      `+94${phone}`,
        password:   password!,
        rememberMe: rememberMe!,
      });
      this.nav.navigateRoot('/customer/tabs/home');
    } catch {
      // error interceptor handles toast
    } finally {
      this.isLoading = false;
    }
  }

  goToRegister(): void {
    this.nav.navigateRoot('/customer/auth/register');
  }

  goToForgotPassword(): void {
    this.nav.navigateRoot('/customer/auth/forgot-password');
  }

  async loginWithGoogle(): Promise<void> {
    await this.toast.showWarning('Google Sign-In coming soon.');
  }

  async loginWithBiometric(): Promise<void> {
    await this.toast.showWarning('Biometric login coming soon.');
  }
}