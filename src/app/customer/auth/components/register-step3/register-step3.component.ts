import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Step3Data } from '../../services/registration.service';

// Custom validator: passwords must match
function passwordsMatch(group: AbstractControl): ValidationErrors | null {
  const pw  = group.get('password')?.value;
  const cpw = group.get('confirmPassword')?.value;
  return pw && cpw && pw !== cpw ? { mismatch: true } : null;
}

@Component({
  selector: 'app-register-step3',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './register-step3.component.html',
  styleUrls: ['./register-step3.component.scss'],
})
export class RegisterStep3Component {
  @Input() isLoading = false;
  @Output() back      = new EventEmitter<void>();
  @Output() submitted = new EventEmitter<Step3Data>();

  private fb = inject(FormBuilder);

  form = this.fb.group({
    password:           ['', [Validators.required, Validators.minLength(8),
                               Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/)]],
    confirmPassword:    ['', Validators.required],
    specialInstructions: [''],
    enableBiometric:    [true],
    acceptedTerms:      [false, Validators.requiredTrue],
  }, { validators: passwordsMatch });

  showPassword  = false;
  showConfirm   = false;

  get pw(): string { return this.form.get('password')?.value ?? ''; }

  get req8():    boolean { return this.pw.length >= 8; }
  get reqUpper():boolean { return /[A-Z]/.test(this.pw); }
  get reqLower():boolean { return /[a-z]/.test(this.pw); }
  get reqNum():  boolean { return /[0-9]/.test(this.pw); }
  get strength():number  { return [this.req8, this.reqUpper, this.reqLower, this.reqNum].filter(Boolean).length; }

  get strengthLabel(): string {
    if (!this.pw) return '';
    return ['', 'Weak', 'Fair', 'Good', 'Strong'][this.strength] + ' password';
  }

  get strengthColor(): string {
    return ['transparent','#ef4444','#f59e0b','#3FBCB9','#10b981'][this.strength];
  }

  get biometric(): boolean { return this.form.get('enableBiometric')?.value ?? true; }
  get terms():     boolean { return this.form.get('acceptedTerms')?.value ?? false; }

  toggleBiometric(): void {
    this.form.patchValue({ enableBiometric: !this.biometric });
  }

  toggleTerms(): void {
    this.form.patchValue({ acceptedTerms: !this.terms });
  }

  onSubmit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    const v = this.form.value;
    this.submitted.emit({
      password:            v.password!,
      enableBiometric:     v.enableBiometric!,
      acceptedTerms:       v.acceptedTerms!,
      specialInstructions: v.specialInstructions || null,
    });
  }

  isInvalid(field: string): boolean {
    const c = this.form.get(field);
    return !!(c?.invalid && c?.touched);
  }
}