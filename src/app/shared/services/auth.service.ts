import { Injectable, inject, signal } from '@angular/core';
import { NavController } from '@ionic/angular/standalone';
import {
  AuthUser,
  CustomerLoginRequest,
  CustomerRegisterRequest,
  DriverLoginRequest,
  LoginResponse,
  OtpVerifyRequest,
  OtpVerifyResponse,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  TwoFactorVerifyRequest,
} from 'src/app/shared/models/auth.model';
import { ApiService } from 'src/app/shared/services/api.service';
import { StorageService } from 'src/app/shared/services/storage.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private api     = inject(ApiService);
  private storage = inject(StorageService);
  private nav     = inject(NavController);

  private _user = signal<AuthUser | null>(null);
  readonly user = this._user.asReadonly();

  // ── Customer login ────────────────────────────────────────────────────────
  async loginCustomer(payload: CustomerLoginRequest): Promise<LoginResponse> {
    const res = await this.api.post<LoginResponse>('/auth/customer/login', payload);
    await this._persistSession(res.data, 'customer');
    return res.data;
  }

  // ── Customer registration ─────────────────────────────────────────────────
  async registerCustomer(payload: CustomerRegisterRequest): Promise<void> {
    await this.api.post('/auth/customer/register', payload);
  }

  // ── OTP verify ────────────────────────────────────────────────────────────
  async verifyOtp(payload: OtpVerifyRequest): Promise<OtpVerifyResponse> {
    const res = await this.api.post<OtpVerifyResponse>('/auth/customer/verify-otp', payload);
    return res.data;
  }

  // ── Resend OTP ────────────────────────────────────────────────────────────
  async resendOtp(phone: string): Promise<void> {
    await this.api.post('/auth/customer/resend-otp', { phone });
  }

  // ── Forgot / Reset password ───────────────────────────────────────────────
  async forgotPassword(payload: ForgotPasswordRequest): Promise<void> {
    await this.api.post('/auth/customer/forgot-password', payload);
  }

  async resetPassword(payload: ResetPasswordRequest): Promise<void> {
    await this.api.post('/auth/customer/reset-password', payload);
  }

  // ── Driver login ──────────────────────────────────────────────────────────
  async loginDriver(payload: DriverLoginRequest): Promise<LoginResponse> {
    const res = await this.api.post<LoginResponse>('/auth/driver/login', payload);
    await this._persistSession(res.data, 'driver');
    return res.data;
  }

  // ── Driver 2FA verify ─────────────────────────────────────────────────────
  async verifyTwoFactor(payload: TwoFactorVerifyRequest): Promise<void> {
    const res = await this.api.post<LoginResponse>('/driver/auth/verify-2fa', payload);
    await this._persistSession(res.data, 'driver');
  }

  // ── Logout ────────────────────────────────────────────────────────────────
  async logout(): Promise<void> {
    await this.storage.clear();
    this._user.set(null);
    await this.nav.navigateRoot('/');
  }

  // ── Session helpers ───────────────────────────────────────────────────────
  async loadSession(): Promise<void> {
    const user = await this.storage.get<AuthUser>('authUser');
    if (user) this._user.set(user);
  }

  isLoggedIn(): boolean {
    return !!this._user();
  }

  async getToken(): Promise<string | null> {
    return this.storage.get<string>('accessToken');
  }

  // ── Private ───────────────────────────────────────────────────────────────
  private async _persistSession(data: any, role: 'customer' | 'driver'): Promise<void> {
    await this.storage.set('accessToken',  data.accessToken);
    await this.storage.set('refreshToken', data.refreshToken);

    const rawUser = role === 'driver' ? data.driver : data.user;

    const authUser: AuthUser = {
      id:        rawUser.id,
      phone:     rawUser.phone,
      role,
      fullName:  rawUser.fullName ?? '',
      email:     rawUser.email     ?? null,
      avatarUrl: rawUser.avatarUrl ?? null,
    };
    
    await this.storage.set('authUser', authUser);
    this._user.set(authUser);
  }
}