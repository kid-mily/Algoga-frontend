import axios from "axios";
import { createAuthInterceptor, errorInterceptor } from "./interceptors";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://kidmily.kro.kr";

// ==========================================
// 1. 일반 유저용 API (일반 로그인, 마이페이지 등)
// ==========================================
export const api = axios.create({
  baseURL: BASE_URL,
});

// 일반 유저는 'accessToken'을 사용하도록 인터셉터 연결
api.interceptors.request.use(createAuthInterceptor("accessToken"));
api.interceptors.response.use((response) => response, errorInterceptor);

// ==========================================
// 2. 관리자(Admin)용 API (강의 관리 등)
// ==========================================
export const adminApi = axios.create({
  baseURL: BASE_URL,
});

// 관리자는 'adminAccessToken'을 사용하도록 인터셉터 연결
adminApi.interceptors.request.use(createAuthInterceptor("adminAccessToken"));
adminApi.interceptors.response.use((response) => response, errorInterceptor);