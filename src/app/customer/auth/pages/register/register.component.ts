import { Component, signal, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { IonContent } from '@ionic/angular/standalone';
import { AuthService } from '../../../../shared/services/auth.service';
import { ToastService } from '../../../../shared/services/toast.service';
import { RegistrationService, Step1Data, Step2Data, Step3Data } from '../../services/registration.service';
import { RegisterStep1Component } from '../../components/register-step1/register-step1.component';
import { RegisterStep2Component } from '../../components/register-step2/register-step2.component';
import { RegisterStep3Component } from '../../components/register-step3/register-step3.component';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [IonContent, RouterLink, RegisterStep1Component, RegisterStep2Component, RegisterStep3Component],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  private auth    = inject(AuthService);
  private reg     = inject(RegistrationService);
  private toast   = inject(ToastService);
  private router  = inject(Router);

  currentStep = signal<1 | 2 | 3>(1);
  isLoading   = false;

  goBack(): void {
    if (this.currentStep() === 1) {
      this.router.navigate(['/customer/auth/login']);
    } else {
      this.currentStep.update(s => (s - 1) as 1 | 2 | 3);
    }
  }

  onStep1Next(data: Step1Data): void {
    this.reg.setStep1(data);
    this.currentStep.set(2);
  }

  onStep2Next(data: Step2Data): void {
    this.reg.setStep2(data);
    this.currentStep.set(3);
  }

  async onStep3Submit(data: Step3Data): Promise<void> {
    this.isLoading = true;
    try {
      const payload = this.reg.buildPayload(data);
      await this.auth.registerCustomer(payload);
      this.reg.clear();
      // Registration triggers OTP — navigate with phone in state
      this.router.navigate(['/customer/auth/otp'], {
        state: { phone: payload.phone }
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Registration failed. Please try again.';
      await this.toast.showError(msg);
    } finally {
      this.isLoading = false;
    }
  }
}