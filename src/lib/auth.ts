// src/api/auth.ts

const API_BASE_URL = "https://kidmily.kro.kr/api/v1/auth";

export const authApi = {
  // 1. 일반 회원가입
  signup: async (formData: any) => {
    // 프론트엔드 상태에는 있지만 백엔드 DTO에는 없는 데이터(passwordConfirm) 제거
    const { passwordConfirm, ...payload } = formData;
    const endpoint = `${API_BASE_URL}/signup`;
    
    // 🌟 터미널(콘솔) 로그 출력
    console.log("🚀 [API 요청] 회원가입(Signup) 시도");
    console.log(`📡 대상 API: POST ${endpoint}`);
    console.log(`📦 전송할 데이터(Payload):`, payload);
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    
    // 🌟 서버 응답 결과 출력
    console.log("📥 [API 응답] 회원가입 서버 응답:", data);

    if (!response.ok) {
      throw new Error(data.message || "회원가입에 실패했습니다.");
    }
    return data;
  },

  // 2. 일반 로그인
  login: async (credentials: { username: string; password: string }) => {
    const endpoint = `${API_BASE_URL}/login`;
    // 🌟 터미널(콘솔) 로그 출력
    console.log("🚀 [API 요청] 로그인(Login) 시도");
    console.log(`📡 대상 API: POST ${endpoint}`);
    console.log(`📦 전송할 데이터(Payload):`, credentials);

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    const data = await response.json();
    
    // 🌟 서버 응답 결과 출력
    console.log("📥 [API 응답] 로그인 서버 응답:", data);

    if (!response.ok) {
      throw new Error(data.message || "로그인에 실패했습니다.");
    }
    return data; // { code, message, data: { accessToken, refreshToken, requiresPasswordChange } }
  },
};