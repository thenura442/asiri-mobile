import { Component, Output, EventEmitter, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Step1Data } from '../../services/registration.service';

@Component({
  selector: 'app-register-step1',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './register-step1.component.html',
  styleUrls: ['./register-step1.component.scss'],
})
export class RegisterStep1Component {
  @Output() next = new EventEmitter<Step1Data>();

  private fb = inject(FormBuilder);

  form = this.fb.group({
    firstName:  ['', [Validators.required, Validators.minLength(2)]],
    lastName:   ['', [Validators.required, Validators.minLength(2)]],
    dobDay:     ['', [Validators.required, Validators.pattern(/^(0?[1-9]|[12]\d|3[01])$/)]],
    dobMonth:   ['', [Validators.required, Validators.pattern(/^(0?[1-9]|1[0-2])$/)]],
    dobYear:    ['', [Validators.required, Validators.pattern(/^(19|20)\d{2}$/)]],
    gender:     ['', Validators.required],
    nic:        ['', [Validators.required, Validators.pattern(/^(\d{9}[VvXx]|\d{12})$/)]],
    bloodGroup: [''],
  });

  readonly genders   = ['male', 'female', 'other'];
  readonly bloodGroups = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];

  // Auto-advance DOB inputs
  onDobInput(event: Event, nextId: string | null): void {
    const input = event.target as HTMLInputElement;
    if (input.value.length >= input.maxLength && nextId) {
      document.getElementById(nextId)?.focus();
    }
  }

  onSubmit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    const v = this.form.value;
    this.next.emit({
      firstName:  v.firstName!,
      lastName:   v.lastName!,
      dobDay:     v.dobDay!,
      dobMonth:   v.dobMonth!,
      dobYear:    v.dobYear!,
      gender:     v.gender!,
      nic:        v.nic!,
      bloodGroup: v.bloodGroup || null,
    });
  }

  isInvalid(field: string): boolean {
    const c = this.form.get(field);
    return !!(c?.invalid && c?.touched);
  }
}