export interface CustomerLoginRequest {
  phone: string;       // E.164: "+947XXXXXXXX"
  password: string;
  rememberMe: boolean;
}

export interface DriverLoginRequest {
  phone: string;
  password: string;
  rememberMe: boolean;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  user: AuthUser;
  requires2fa: boolean;
}

export interface AuthUser {
  id: string;
  fullName: string;
  phone: string;
  email: string | null;
  avatarUrl: string | null;
  flag?: string;
  role: 'customer' | 'driver';
}

export interface CustomerRegisterRequest {
  // Step 1
  firstName: string;
  lastName: string;
  dateOfBirth: string;      // ISO-8601: "2000-03-15"
  gender: 'male' | 'female' | 'other';
  nic: string;
  bloodGroup: string | null;
  // Step 2
  phone: string;            // E.164
  email: string | null;
  emergencyContactName: string | null;
  emergencyContactPhone: string | null;
  address: string;
  city: string;
  district: string;
  // Step 3
  password: string;
  enableBiometric: boolean;
  acceptedTerms: boolean;
  specialInstructions: string | null;
}

export interface OtpVerifyRequest {
  phone: string;
  code: string;
}

export interface OtpVerifyResponse {
  verified:  boolean;
  patientId: string;
}

export interface ForgotPasswordRequest {
  method: 'phone' | 'email';
  phone?: string;
  email?: string;
}

export interface ResetPasswordRequest {
  phone: string;
  code: string;
  newPassword: string;
}

export interface BiometricAuthRequest {
  biometricToken: string;
  deviceId: string;
}

export interface TwoFactorVerifyRequest {
  code: string;            // 6-digit TOTP
}