import { InternalAxiosRequestConfig, AxiosError } from "axios";

// 🌟 토큰과 데이터 타입(JSON/FormData)을 알아서 세팅해주는 함수
export const createAuthInterceptor = (
  tokenKey: "accessToken" | "adminAccessToken"
) => {
  return (config: InternalAxiosRequestConfig) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem(tokenKey);

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      const isFormData = config.data instanceof FormData;

      if (isFormData) {
        delete config.headers["Content-Type"];
      } else {
        config.headers["Content-Type"] = "application/json";
      }
    }

    return config;
  };
};

//  에러 공통 처리 함수
export const errorInterceptor = (error: AxiosError) => {
  const errorData = error.response?.data;
  const status = error.response?.status; //  상태 코드 추출

  console.log("API 요청 실패:", {
    url: error.config?.url,
    baseURL: error.config?.baseURL,
    status: status,
    message: (errorData as any)?.message,
    data: errorData,
  });

  if (typeof window !== "undefined") {
    sessionStorage.setItem("errorData", JSON.stringify(errorData));

    // 1️치명적인 서버 에러(500)인 경우에만 500 에러 페이지로 강제 이동
    if (status === 500) {
      window.location.href = "/error/500"; // 또는 Next.js의 error.tsx가 잡도록 놔둬도 됩니다.
      return Promise.reject(error);
    }

    // 2️ 500 에러가 아닌 나머지 모든 에러(400, 404, 409 등)는 전역 모달을 띄움
    window.dispatchEvent(
      new CustomEvent("api-error", {
        detail: errorData,
      })
    );
  }

  return Promise.reject(error);

};