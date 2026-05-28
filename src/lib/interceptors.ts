import { InternalAxiosRequestConfig, AxiosError } from "axios";

// 🌟 토큰과 데이터 타입(JSON/FormData)을 알아서 세팅해주는 함수
export const createAuthInterceptor = (tokenKey: "accessToken" | "adminAccessToken") => {
  return (config: InternalAxiosRequestConfig) => {
    if (typeof window !== "undefined") {
      // 1. 토큰 세팅 (인자로 받은 tokenKey에 따라 일반/관리자 토큰을 구분해서 가져옴)
      const token = localStorage.getItem(tokenKey);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      // 2. FormData(파일 업로드)와 JSON 자동 구분 로직 (기존 코드 완벽 보존)
      const isFormData = config.data instanceof FormData;
      if (isFormData) {
        delete config.headers["Content-Type"]; // 브라우저가 boundary를 자동 설정하도록 지움
      } else {
        config.headers["Content-Type"] = "application/json"; // 기본은 JSON
      }
    }
    return config;
  };
};

// 🌟 에러 공통 처리 함수
export const errorInterceptor = (error: AxiosError) => {
  console.log("API 요청 실패:", {
    url: error.config?.url,
    baseURL: error.config?.baseURL,
    status: error.response?.status,
    message: (error.response?.data as any)?.message,
    data: error.response?.data,
  });

  return Promise.reject(error);
};