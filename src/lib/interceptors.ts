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

// 🌟 에러 공통 처리 함수
export const errorInterceptor = (error: AxiosError) => {
  const errorData = error.response?.data;

  console.log("API 요청 실패:", {
    url: error.config?.url,
    baseURL: error.config?.baseURL,
    status: error.response?.status,
    message: (errorData as any)?.message,
    data: errorData,
  });

  if (typeof window !== "undefined") {
    sessionStorage.setItem(
      "errorData",
      JSON.stringify(errorData)
    );

    // 테스트 중: 모든 에러를 모달로
    window.dispatchEvent(
      new CustomEvent("api-error", {
        detail: errorData,
      })
    );

    /*
    배포 시 사용

    const status = error.response?.status;

    if (status === 400) {
      window.location.href = "/error/400";
      return Promise.reject(error);
    }

    if (status === 500) {
      window.location.href = "/error/500";
      return Promise.reject(error);
    }

    window.dispatchEvent(
      new CustomEvent("api-error", {
        detail: errorData,
      })
    );
    */
  }

  return Promise.reject(error);
};