// ==========================================
// 1. 공통 도메인 타입
// ==========================================

export interface User {
  id: number;
  username: string; 
  email: string;
  name: string;
  nickname: string; 
  role: 'USER' | 'ADMIN'; 
  
  // (선택) 서비스에서 마이페이지 등에 필요하다면 아래 항목들도 추가 가능합니다.
  phone?: string;
  birthDate?: string;
  gender?: 'MALE' | 'FEMALE' | 'OTHER';
}


// ==========================================
// 2. Auth (로그인) 관련 타입
// ==========================================

export interface LoginRequest {
  username: string; 
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken?: string; 
  user: User;
}


// ==========================================
// 3. Auth (회원가입) 관련 타입
// ==========================================

export interface SignupRequest {
  username: string;
  email: string;
  password: string;
  name: string;
  phone: string;
  birthDate: string; // 백엔드 LocalDate 매칭용 ('YYYY-MM-DD' 형식)
  gender: string; 
  nickname: string;
  
  // 선택 사항 (선택 사항은 ? 처리)
  referralCode?: string; 
  signupPath?: string; 
  
  // 약관 동의 (백엔드 필수값 @NotNull)
  termsServiceAgreed: boolean;
  termsPrivacyAgreed: boolean;
  termsMarketingAgreed: boolean;
}

// 회원가입 응답 타입 (백엔드 설계에 따라 변경될 수 있음)
export interface SignupResponse {
  message?: string; // 예: "회원가입이 완료되었습니다."
  user?: User;      // 가입된 유저 정보를 바로 내려주는 경우
  // 백엔드가 회원가입 직후 자동 로그인을 시켜준다면 accessToken이 들어올 수도 있습니다.
}