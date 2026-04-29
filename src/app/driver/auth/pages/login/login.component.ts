import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { NgStyle } from '@angular/common';
import { IonContent } from '@ionic/angular/standalone';
import { NavController } from '@ionic/angular/standalone';
import { AuthService } from '../../../../shared/services/auth.service';

interface Particle { left: number; bottom: number; d: number; dl: number; }

@Component({
  selector: 'app-driver-login',
  standalone: true,
  imports: [IonContent, ReactiveFormsModule, NgStyle],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class DriverLoginComponent {
  private fb   = inject(FormBuilder);
  private auth = inject(AuthService);
  private nav  = inject(NavController);

  form = this.fb.group({
    phone:      ['', [Validators.required, Validators.pattern(/^7[0-9]{8}$/)]],
    password:   ['', [Validators.required, Validators.minLength(8)]],
    rememberMe: [true],
  });

  showPassword = false;
  isLoading    = false;

  readonly particles: Particle[] = [
    { left: 10, bottom: 15, d: 4,   dl: 0   },
    { left: 35, bottom: 30, d: 5.2, dl: 0.7 },
    { left: 60, bottom: 10, d: 4.5, dl: 0.3 },
    { left: 82, bottom: 22, d: 5.8, dl: 1.1 },
    { left: 48, bottom: 42, d: 5.5, dl: 0.5 },
  ];

  particleStyle(p: Particle): { [key: string]: string } {
    return { left: `${p.left}%`, bottom: `${p.bottom}%`, '--d': `${p.d}s`, '--dl': `${p.dl}s` };
  }

  get phoneInvalid():    boolean { const c = this.form.get('phone');    return !!(c?.invalid && c?.touched); }
  get passwordInvalid(): boolean { const c = this.form.get('password'); return !!(c?.invalid && c?.touched); }
  get rememberMe():      boolean { return this.form.get('rememberMe')?.value ?? true; }

  togglePassword(): void { this.showPassword = !this.showPassword; }
  toggleRemember(): void { this.form.patchValue({ rememberMe: !this.rememberMe }); }

  async onSubmit(): Promise<void> {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.isLoading = true;
    try {
      const { phone, password, rememberMe } = this.form.value;
      await this.auth.loginDriver({
        phone: `+94${phone}`, password: password!, rememberMe: rememberMe!,
      });
      // Always go directly to dashboard — no 2FA for drivers
      await this.nav.navigateRoot('/driver/tabs/my-job');
    } catch {
      // interceptor handles error toast
    } finally {
      this.isLoading = false;
    }
  }

  async loginWithBiometric(): Promise<void> {
    // coming soon
  }
}