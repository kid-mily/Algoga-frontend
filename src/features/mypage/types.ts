export interface ApiErrorResponse {
  timestamp?: string;
  status?: number;
  code?: string;
  errorCode?: string;
  message?: string;
  traceId?: string;
}

export type UserGender = "MALE" | "FEMALE" | string;

export interface MyPageUser {
  username: string;
  password?: string;
  name: string;
  nickname: string;
  email: string;
  profileImageUrl: string | null;
  phone: string;
  gender: UserGender;
  birthDate: string;
  personalCode: string;
}

export interface MyPageSummary {
  courseCount: number;
  reservationCount: number;
  couponCount: number;
}

export interface MyPageData {
  user: MyPageUser;
  summary: MyPageSummary;
}

export interface UpdateProfileRequest {
  nickname: string;
  phone: string;
  email: string;
  profileImage: File | null;
}

export interface UpdateProfileResponse {
  accessToken?: string;
  refreshToken?: string;
  requiresPasswordChange?: boolean;
  nickname?: string;
  profileImageUrl?: string | null;
}

export interface VerifyPasswordRequest {
  password: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface CertificatePdfFile {
  blob: Blob;
  fileName: string;
}

export interface CertificatePdfData extends CertificatePdfFile {
  url: string;
}

