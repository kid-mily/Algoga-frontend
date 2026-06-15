// 사용자 성별
export type UserGender = "MALE" | "FEMALE" | string;

// 로그인한 사용자 전체 정보
export interface MyPageUser {
  username: string;
  password: string;
  name: string;
  nickname: string;
  email: string;
  profileImageUrl: string | null;
  phone: string;
  gender: UserGender;
  birthDate: string;
  personalCode: string;
}

// 프로필 수정 요청 데이터
export interface UpdateProfileRequest {
  nickname: string;
  phone: string;
  email: string;
  profileImage: File | null;
}

// 프로필 수정 성공 응답
export interface UpdateProfileResponse {
  accessToken: string;
  refreshToken: string;
  requiresPasswordChange: boolean;
}

// 비밀번호 확인 요청
export interface VerifyPasswordRequest {
  password: string;
}

// 비밀번호 변경 요청
export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

// 백엔드 공통 응답
export interface ApiResponse<T> {
  timestamp: string;
  status: number;
  code: string;
  message: string;
  data: T;
}

// 백엔드 오류 응답
export interface ApiErrorResponse {
  timestamp?: string;
  status?: number;
  code?: string;
  errorCode?: string;
  message?: string;
  traceId?: string;
}

export interface UpdateProfileRequest {
  nickname: string;
  phone: string;
  email: string;
  profileImage: File | null;
}

export interface UpdateProfileResponse {
  accessToken: string;
  refreshToken: string;
  requiresPasswordChange: boolean;
}

export interface VerifyPasswordRequest {
  password: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}