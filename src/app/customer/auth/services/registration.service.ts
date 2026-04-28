import { Injectable, signal } from '@angular/core';
import { CustomerRegisterRequest } from '../../../shared/models/auth.model';

// Partial types per step
export interface Step1Data {
  firstName:   string;
  lastName:    string;
  dobDay:      string;
  dobMonth:    string;
  dobYear:     string;
  gender:      string;
  nic:         string;
  bloodGroup:  string | null;
}

export interface Step2Data {
  phone:                  string;
  email:                  string | null;
  emergencyContactName:   string | null;
  emergencyContactPhone:  string | null;
  address:                string;
  city:                   string;
  district:               string;
}

export interface Step3Data {
  password:           string;
  enableBiometric:    boolean;
  acceptedTerms:      boolean;
  specialInstructions: string | null;
}

@Injectable({ providedIn: 'root' })
export class RegistrationService {
  private step1 = signal<Step1Data | null>(null);
  private step2 = signal<Step2Data | null>(null);

  setStep1(data: Step1Data): void { this.step1.set(data); }
  setStep2(data: Step2Data): void { this.step2.set(data); }

  buildPayload(step3: Step3Data): CustomerRegisterRequest {
    const s1 = this.step1()!;
    const s2 = this.step2()!;
    const dob = `${s1.dobYear}-${s1.dobMonth.padStart(2,'0')}-${s1.dobDay.padStart(2,'0')}`;
    return {
      firstName:              s1.firstName,
      lastName:               s1.lastName,
      dateOfBirth:            dob,
      gender:                 s1.gender as 'male' | 'female' | 'other',
      nic:                    s1.nic,
      bloodGroup:             s1.bloodGroup,
      phone:                  `+94${s2.phone}`,
      email:                  s2.email || null,
      emergencyContactName:   s2.emergencyContactName || null,
      emergencyContactPhone:  s2.emergencyContactPhone ? `+94${s2.emergencyContactPhone}` : null,
      address:                s2.address,
      city:                   s2.city,
      district:               s2.district,
      password:               step3.password,
      enableBiometric:        step3.enableBiometric,
      acceptedTerms:          step3.acceptedTerms,
      specialInstructions:    step3.specialInstructions || null,
    };
  }

  clear(): void {
    this.step1.set(null);
    this.step2.set(null);
  }
}