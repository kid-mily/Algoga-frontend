import { LoginRequest, LoginResponse } from "@/features/auth/types";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const login = async (user: LoginRequest): Promise<LoginResponse> => {
  const response = await fetch(`${BASE_URL}/api/v1/auth/login`, {
    method: 'POST',
    body: JSON.stringify(user),
    headers: {
      'Content-Type': 'application/json'
    },
    // credentials: 'include', // 📌 백엔드에서 HttpOnly 쿠키로 인증을 처리한다면 주석을 해제하세요.
  });

  if (!response.ok) {
    let errorMessage = '로그인 실패';
    try {
      // 응답이 JSON 형식일 경우 에러 메시지 추출
      const errorData = await response.json();
      errorMessage = errorData?.message || errorMessage;
    } catch (e) {
      // 응답이 JSON이 아닐 경우(HTML, Plain text 등) HTTP 상태 텍스트 사용
      errorMessage = response.statusText || errorMessage;
    }
    throw new Error(errorMessage);
  }

  return response.json();
}