// services/auth.service.ts
import { LoginRequest, LoginResponse } from "@/features/auth/types";
import { api } from "@/lib/api"; // 위에서 만든 axios 인스턴스 가져오기

export const login = async (user: LoginRequest): Promise<LoginResponse> => {
  try {
    const response = await api.post('/api/v1/auth/login', user);
    
    // 🌟 백엔드의 ApiResponse 구조상 실제 토큰은 response.data.data 안에 있음
    return response.data.data;
  } catch (error: any) {
    // 백엔드 에러 메시지 추출
    const errorMessage = error.response?.data?.message || '로그인 실패';
    throw new Error(errorMessage);
  }
};