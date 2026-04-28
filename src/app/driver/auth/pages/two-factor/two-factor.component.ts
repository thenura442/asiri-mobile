import { Component, OnInit, ViewChildren, QueryList, ElementRef, inject } from '@angular/core';
import { Router } from '@angular/router';
import { IonContent } from '@ionic/angular/standalone';
import { AuthService } from '../../../../shared/services/auth.service';
import { ToastService } from '../../../../shared/services/toast.service';

@Component({
  selector: 'app-two-factor',
  standalone: true,
  imports: [IonContent],
  templateUrl: './two-factor.component.html',
  styleUrls: ['./two-factor.component.scss'],
})
export class TwoFactorComponent implements OnInit {
  private auth   = inject(AuthService);
  private toast  = inject(ToastService);
  private router = inject(Router);

  @ViewChildren('otpInput') otpInputs!: QueryList<ElementRef<HTMLInputElement>>;

  otpValues = ['', '', '', '', '', ''];
  isLoading = false;

  ngOnInit(): void {}

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
      await this.auth.verifyTwoFactor({ code });
      this.router.navigate(['/driver/tabs/my-job'], { replaceUrl: true });
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

  goBack(): void { this.router.navigate(['/driver/auth/login']); }
}