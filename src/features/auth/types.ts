// src/features/auth/types.ts

export interface User {
  id: number;
  username: string;
  email: string;
  name: string;
  nickname: string;
  role: "USER" | "ADMIN";

  phone?: string;
  birthDate?: string;
  gender?: "MALE" | "FEMALE" | "OTHER";
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken?: string;
  requiresPasswordChange: boolean;
}

export interface SignupRequest {
  username: string;
  email: string;
  password: string;
  name: string;
  phone: string;
  birthDate: string;
  gender: string;
  nickname: string;
  referralCode?: string;
  signupPath?: string;
  termsServiceAgreed: boolean;
  termsPrivacyAgreed: boolean;
  termsMarketingAgreed: boolean;
}

export interface SignupResponse {
  message?: string;
  user?: User;
}

export interface FindPasswordRequest {
  username: string;
  email: string;
}

export interface FindIdRequest {
  name: string;
  email: string;
}

export interface ResetPasswordRequest {
  newPassword: string;
}

export interface UserProfileResponse {
  username: string;
  name: string;
  nickname: string;
  email: string;
  profileImageUrl?: string;
  phone: string;
  gender: string;
  birthDate: string;
  personalCode: string;
}

export interface UpdatePasswordRequest {
  currentPassword: string;
  newPassword: string;
}