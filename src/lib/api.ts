// src/lib/api.ts

import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://kidmily.kro.kr";

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const url = config.url || "";

      const accessToken = localStorage.getItem("accessToken");
      const adminAccessToken = localStorage.getItem("adminAccessToken");

      const isAdminApi = url.startsWith("/api/v1/admin");
      const token = isAdminApi ? adminAccessToken : accessToken;

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.log("API 요청 실패:", {
      url: error.config?.url,
      baseURL: error.config?.baseURL,
      status: error.response?.status,
      message: error.response?.data?.message,
      data: error.response?.data,
    });

    return Promise.reject(error);
  }
);