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
  requiresPasswordChange?: boolean;
}

export interface AuthSessionInfo {
  expiresAt: string;
  remainingSeconds: number;
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

export type SocialType = "GOOGLE" | "KAKAO";

export interface SocialSignupRequest {
  email: string;
  name: string;
  phone: string;
  birthDate: string;
  gender: string;
  nickname: string;
  socialType: SocialType;
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

export interface FindIdResponse {
  maskedId: string;
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

export type RegisterFormData = {
  name: string;
  username: string;
  password: string;
  passwordConfirm: string;
  email: string;
  phone: string;
  birthDate: string;
  gender: string;
  nickname: string;
  socialType: SocialType | "";
  referralCode: string;
  signupPath: string;
  termsServiceAgreed: boolean;
  termsPrivacyAgreed: boolean;
  termsMarketingAgreed: boolean;
};

export type ServerError = {
  field: string;
  message: string;
};

export type RegisterCompleteFormProps = {
  formData?: Pick<RegisterFormData, "name" | "nickname">;
};

export interface LoginSidebarProps {
  title: {
    normal: string;
    accent: string;
  };
  description: string;
}

export interface AuthPageHeaderProps {
  title: string;
  description: string;
  backText?: string;
}

export interface FindIdCompleteProps {
  userId: string;
}

export interface RegisterStepHeaderProps {
  currentStep: number;
}

export interface RegisterAgreeFormProps {
  formData: any;
  onChange: (field: string, value: boolean) => void;
  onPrev: () => void;
  onNext: () => void;
}

export interface RegisterInfoFormProps {
  formData: RegisterFormData;
  onChange: (field: string, value: string) => void;
  onNext: () => void;
  isLoading?: boolean;
  serverError?: { field: string; message: string }; // 객체 형태로 변경
  setServerError?: (err: { field: string; message: string }) => void; // 객체 형태로 변경
  isSocialSignup?: boolean;
}


export type ValidateRegisterInfoOptions = {
  isSocialSignup?: boolean;
  isUsernameChecked?: boolean;
  isEmailVerified?: boolean;
};