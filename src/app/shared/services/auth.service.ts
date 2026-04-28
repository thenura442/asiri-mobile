import { Injectable, inject, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from './api.service';
import { StorageService } from './storage.service';
import {
  CustomerLoginRequest,
  DriverLoginRequest,
  LoginResponse,
  CustomerRegisterRequest,
  OtpVerifyRequest,
  OtpVerifyResponse,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  AuthUser,
  BiometricAuthRequest,
  TwoFactorVerifyRequest,
} from '../models/auth.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private api = inject(ApiService);
  private storage = inject(StorageService);
  private router = inject(Router);

  // ── State ─────────────────────────────────────────────────────────
  currentUser = signal<AuthUser | null>(null);
  isAuthenticated = computed(() => this.currentUser() !== null);

  // ── Customer Auth ─────────────────────────────────────────────────
  async loginCustomer(payload: CustomerLoginRequest): Promise<LoginResponse> {
    const res = await this.api.post<LoginResponse>('/auth/login', payload);
    await this.persistSession(res.data);
    return res.data;
  }

  async registerCustomer(payload: CustomerRegisterRequest): Promise<LoginResponse> {
    const res = await this.api.post<LoginResponse>('/auth/register', payload);
    // registration returns same LoginResponse — then OTP verification is required
    return res.data;
  }

  async verifyOtp(payload: OtpVerifyRequest): Promise<OtpVerifyResponse> {
    const res = await this.api.post<OtpVerifyResponse>('/auth/verify-otp', payload);
    if (res.data.accessToken) {
      await this.storage.set('access_token', res.data.accessToken);
      await this.storage.set('refresh_token', res.data.refreshToken);
    }
    return res.data;
  }

  async resendOtp(phone: string): Promise<void> {
    await this.api.post('/auth/resend-otp', { phone });
  }

  async forgotPassword(payload: ForgotPasswordRequest): Promise<void> {
    await this.api.post('/auth/forgot-password', payload);
  }

  async resetPassword(payload: ResetPasswordRequest): Promise<void> {
    await this.api.post('/auth/reset-password', payload);
  }

  async loginWithBiometric(payload: BiometricAuthRequest): Promise<LoginResponse> {
    const res = await this.api.post<LoginResponse>('/auth/biometric', payload);
    await this.persistSession(res.data);
    return res.data;
  }

  // ── Driver Auth ───────────────────────────────────────────────────
  async loginDriver(payload: DriverLoginRequest): Promise<LoginResponse> {
    const res = await this.api.post<LoginResponse>('/auth/driver/login', payload);
    await this.persistSession(res.data);
    return res.data;
  }

  async verifyTwoFactor(payload: TwoFactorVerifyRequest): Promise<LoginResponse> {
    const res = await this.api.post<LoginResponse>('/auth/driver/verify-2fa', payload);
    await this.persistSession(res.data);
    return res.data;
  }

  // ── Session ───────────────────────────────────────────────────────
  async restoreSession(): Promise<boolean> {
    try {
      const token = await this.storage.get('access_token');
      if (!token) return false;
      const res = await this.api.get<AuthUser>('/auth/session');
      this.currentUser.set(res.data);
      return true;
    } catch {
      await this.clearSession();
      return false;
    }
  }

  async logout(): Promise<void> {
    await this.clearSession();
    this.router.navigate(['/'], { replaceUrl: true });
  }

  // ── Helpers ───────────────────────────────────────────────────────
  private async persistSession(data: LoginResponse): Promise<void> {
    await this.storage.set('access_token', data.accessToken);
    await this.storage.set('refresh_token', data.refreshToken);
    this.currentUser.set(data.user);
  }

  private async clearSession(): Promise<void> {
    await this.storage.remove('access_token');
    await this.storage.remove('refresh_token');
    this.currentUser.set(null);
  }
}