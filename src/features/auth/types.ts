// 유저 정보 타입
export interface User {
  id: number;
  username: string; // 추가: 로그인 시 사용한 아이디
  email: string;
  name: string;
  nickname: string; // 추가: 회원가입 시 입력받은 닉네임 (UI 표시에 자주 쓰임)
  role: 'USER' | 'ADMIN'; // 단순 string보다는 리터럴 유니온 타입 권장
  
  // (선택) 서비스에서 마이페이지 등에 필요하다면 아래 항목들도 추가 가능합니다.
  phone?: string;
  birthDate?: string;
  gender?: 'MALE' | 'FEMALE' | 'OTHER';
}

// 로그인 요청 타입
export interface LoginRequest {
  username: string; // 수정: 백엔드 명세에 맞춰 이메일 대신 아이디(username)로 변경
  password: string;
}

// 로그인 응답 타입
export interface LoginResponse {
  accessToken: string;
  refreshToken?: string; // (선택) 보안을 위해 리프레시 토큰을 함께 쓴다면 추가
  user: User;
}