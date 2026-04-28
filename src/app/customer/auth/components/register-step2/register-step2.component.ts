import { Component, Output, EventEmitter, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Step2Data } from '../../services/registration.service';

@Component({
  selector: 'app-register-step2',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './register-step2.component.html',
  styleUrls: ['./register-step2.component.scss'],
})
export class RegisterStep2Component {
  @Output() back = new EventEmitter<void>();
  @Output() next = new EventEmitter<Step2Data>();

  private fb = inject(FormBuilder);

  form = this.fb.group({
    phone:                 ['', [Validators.required, Validators.pattern(/^7[0-9]{8}$/)]],
    email:                 ['', [Validators.email]],
    emergencyContactName:  [''],
    emergencyContactPhone: ['', [Validators.pattern(/^7[0-9]{8}$/)]],
    address:               ['', Validators.required],
    city:                  ['', Validators.required],
    district:              [''],
  });

  readonly districts = [
    'Colombo','Gampaha','Kalutara','Kandy','Matale','Nuwara Eliya',
    'Galle','Matara','Hambantota','Jaffna','Kilinochchi','Mannar',
    'Vavuniya','Mullaitivu','Batticaloa','Ampara','Trincomalee',
    'Kurunegala','Puttalam','Anuradhapura','Polonnaruwa','Badulla',
    'Monaragala','Ratnapura','Kegalle',
  ];

  onSubmit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    const v = this.form.value;
    this.next.emit({
      phone:                 v.phone!,
      email:                 v.email || null,
      emergencyContactName:  v.emergencyContactName || null,
      emergencyContactPhone: v.emergencyContactPhone || null,
      address:               v.address!,
      city:                  v.city!,
      district:              v.district || '',
    });
  }

  isInvalid(field: string): boolean {
    const c = this.form.get(field);
    return !!(c?.invalid && c?.touched);
  }
}