import { InternalAxiosRequestConfig, AxiosError } from "axios";

export const createAuthInterceptor = () => {
  return (config: InternalAxiosRequestConfig) => {
    if (typeof window !== "undefined") {
      config.withCredentials = true;

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

export const errorInterceptor = (error: AxiosError) => {
  const errorData = error.response?.data as { message?: string } | undefined;
  const status = error.response?.status;

  console.log("API 요청 실패:", {
    url: error.config?.url,
    baseURL: error.config?.baseURL,
    status: status,
    message: errorData?.message,
    data: errorData,
  });

  if (typeof window !== "undefined") {
    sessionStorage.setItem("errorData", JSON.stringify(errorData));

    if (status === 500) {
      window.location.href = "/error/500";
      return Promise.reject(error);
    }

    window.dispatchEvent(
      new CustomEvent("api-error", {
        detail: errorData,
      })
    );
  }

  return Promise.reject(error);
};
