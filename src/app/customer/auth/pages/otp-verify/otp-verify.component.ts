import { Component, OnInit, OnDestroy, ViewChildren, QueryList, ElementRef, inject } from '@angular/core';
import { Router } from '@angular/router';
import { IonContent } from '@ionic/angular/standalone';
import { AuthService } from '../../../../shared/services/auth.service';
import { ToastService } from '../../../../shared/services/toast.service';

@Component({
  selector: 'app-otp-verify',
  standalone: true,
  imports: [IonContent],
  templateUrl: './otp-verify.component.html',
  styleUrls: ['./otp-verify.component.scss'],
})
export class OtpVerifyComponent implements OnInit, OnDestroy {
  private auth   = inject(AuthService);
  private toast  = inject(ToastService);
  private router = inject(Router);

  @ViewChildren('otpInput') otpInputs!: QueryList<ElementRef<HTMLInputElement>>;

  phone       = '';
  otpValues   = ['', '', '', '', '', ''];
  isLoading   = false;
  timerSecs   = 120;
  timerDisplay = '02:00';
  canResend   = false;
  private interval?: ReturnType<typeof setInterval>;

  ngOnInit(): void {
    // Phone passed via router state from registration/login
    const nav = this.router.getCurrentNavigation();
    this.phone = (nav?.extras?.state?.['phone'] as string) ?? history.state?.phone ?? '';
    this.startTimer();
  }

  ngOnDestroy(): void {
    clearInterval(this.interval);
  }

  private startTimer(): void {
    this.timerSecs = 120;
    this.canResend = false;
    this.interval = setInterval(() => {
      this.timerSecs--;
      const m = Math.floor(this.timerSecs / 60);
      const s = this.timerSecs % 60;
      this.timerDisplay = `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
      if (this.timerSecs <= 0) {
        clearInterval(this.interval);
        this.canResend = true;
        this.timerDisplay = '00:00';
      }
    }, 1000);
  }

  onInput(event: Event, index: number): void {
    const input = event.target as HTMLInputElement;
    const val = input.value.replace(/\D/, '').slice(0, 1);
    input.value = val;
    this.otpValues[index] = val;

    if (val && index < 5) {
      this.otpInputs.toArray()[index + 1]?.nativeElement.focus();
    }

    if (this.otpValues.every(v => v !== '')) {
      this.onVerify();
    }
  }

  onKeydown(event: KeyboardEvent, index: number): void {
    if (event.key === 'Backspace' && !this.otpValues[index] && index > 0) {
      this.otpValues[index - 1] = '';
      const prev = this.otpInputs.toArray()[index - 1];
      if (prev) { prev.nativeElement.value = ''; prev.nativeElement.focus(); }
    }
  }

  async onVerify(): Promise<void> {
    const code = this.otpValues.join('');
    if (code.length < 6) { await this.toast.showError('Please enter all 6 digits.'); return; }
    this.isLoading = true;
    try {
      await this.auth.verifyOtp({ phone: this.phone, code });
      this.router.navigate(['/customer/tabs/home'], { replaceUrl: true });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Invalid code. Please try again.';
      await this.toast.showError(msg);
      this.otpValues = ['', '', '', '', '', ''];
      this.otpInputs.toArray().forEach(i => (i.nativeElement.value = ''));
      this.otpInputs.first?.nativeElement.focus();
    } finally {
      this.isLoading = false;
    }
  }

  async onResend(): Promise<void> {
    if (!this.canResend) return;
    try {
      await this.auth.resendOtp(this.phone);
      await this.toast.showSuccess('New code sent!');
      this.startTimer();
    } catch {
      await this.toast.showError('Failed to resend. Please try again.');
    }
  }

  get maskedPhone(): string {
    if (!this.phone) return '';
    return this.phone.replace(/(\+94)(\d{2})(\d+)(\d{4})/, '$1 $2 ••• $4');
  }

  goBack(): void { this.router.navigate(['/customer/auth/register']); }
}