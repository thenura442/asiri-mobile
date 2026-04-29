import { Component, OnInit, OnDestroy, ViewChildren, QueryList, ElementRef, inject } from '@angular/core';
import { IonContent } from '@ionic/angular/standalone';
import { NavController } from '@ionic/angular/standalone';
import { AuthService } from '../../../../shared/services/auth.service';
import { ToastService } from '../../../../shared/services/toast.service';
import { AuthUser } from 'src/app/shared/models/auth.model';

@Component({
  selector: 'app-otp-verify',
  standalone: true,
  host: { class: 'ion-page' },
  imports: [IonContent],
  templateUrl: './otp-verify.component.html',
  styleUrls: ['./otp-verify.component.scss'],
})
export class OtpVerifyComponent implements OnInit, OnDestroy {
  private auth  = inject(AuthService);
  private toast = inject(ToastService);
  private nav   = inject(NavController);

  @ViewChildren('otpInput') otpInputs!: QueryList<ElementRef<HTMLInputElement>>;

  phone        = '';
  accessToken  = '';
  refreshToken = '';
  user: AuthUser | null = null;

  otpValues    = ['', '', '', '', '', ''];
  isLoading    = false;
  timerSecs    = 120;
  timerDisplay = '02:00';
  canResend    = false;
  private interval?: ReturnType<typeof setInterval>;

  ngOnInit(): void {
    this.phone        = history.state?.phone        ?? '';
    this.accessToken  = history.state?.accessToken  ?? '';
    this.refreshToken = history.state?.refreshToken ?? '';
    this.user         = history.state?.user         ?? null;
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

  // onInput(event: Event, index: number): void {
  //   const input = event.target as HTMLInputElement;
  //   const val = input.value.replace(/\D/, '').slice(0, 1);
  //   input.value = val;
  //   this.otpValues[index] = val;
  //   if (val && index < 5) {
  //     this.otpInputs.toArray()[index + 1]?.nativeElement.focus();
  //   }
  //   if (this.otpValues.every(v => v !== '')) {
  //     this.onVerify();
  //   }
  // }

  onKeydown(event: KeyboardEvent, index: number): void {
    if (event.key === 'Backspace' && !this.otpValues[index] && index > 0) {
      this.otpValues[index - 1] = '';
      const prev = this.otpInputs.toArray()[index - 1];
      if (prev) { prev.nativeElement.value = ''; prev.nativeElement.focus(); }
    }
  }

  // async onVerify(): Promise<void> {
  //   const code = this.otpValues.join('');
  //   if (code.length < 6) {
  //     await this.toast.showError('Please enter all 6 digits.');
  //     return;
  //   }
  //   this.isLoading = true;
  //   try {
  //     await this.auth.verifyOtp({ phone: this.phone, code });
  //     // Save tokens only after OTP confirmed
  //     if (this.accessToken && this.refreshToken && this.user) {
  //       await this.auth.completeRegistration(
  //         this.accessToken,
  //         this.refreshToken,
  //         this.user,
  //       );
  //     }
  //     await this.toast.showSuccess('Phone verified! Welcome to Asiri.');
  //     this.nav.navigateRoot('/customer/tabs/home');
  //   } catch {
  //     this.otpValues = ['', '', '', '', '', ''];
  //     this.otpInputs.toArray().forEach(i => (i.nativeElement.value = ''));
  //     this.otpInputs.first?.nativeElement.focus();
  //   } finally {
  //     this.isLoading = false;
  //   }
  // }

  async onResend(): Promise<void> {
    if (!this.canResend) return;
    try {
      await this.auth.resendOtp(this.phone);
      await this.toast.showSuccess('New code sent!');
      this.startTimer();
    } catch {
      // interceptor handles error toast
    }
  }

  get maskedPhone(): string {
    if (!this.phone) return '';
    return this.phone.replace(/(\+94)(\d{2})(\d+)(\d{4})/, '$1 $2 ••• $4');
  }

  goBack(): void {
    this.nav.navigateRoot('/customer/auth/register');
  }
}