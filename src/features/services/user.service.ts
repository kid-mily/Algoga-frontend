import { api } from "@/lib/api"; // notice.service.ts의 import 규칙을 따름

export const getMe = async () => {
  try {
    // lib/api.ts의 인터셉터가 브라우저 환경(Client)에서 자동으로 헤더에 accessToken을 주입합니다.
    const response = await api.get('/api/v1/users/me');
    
    // 백엔드 UserController의 ApiResponse 공통 포맷 내부의 실제 데이터(data)를 반환합니다.
    return response.data.data; 
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || '유저 정보 조회 실패';
    throw new Error(errorMessage);
  }
};