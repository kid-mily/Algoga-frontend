// lib/api.ts
import axios from 'axios';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:15000';

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 🌟 요청 인터셉터: 모든 API 요청이 전송되기 전에 실행됩니다.
api.interceptors.request.use(
  (config) => {
    // Next.js 환경이므로 window 객체가 있을 때만 localStorage 접근
    if (typeof window !== 'undefined') {
      const accessToken = localStorage.getItem('accessToken');
      if (accessToken) {
        // 토큰이 있으면 모든 헤더에 Authorization 추가
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// (선택) 응답 인터셉터: 401(인증 에러) 발생 시 로그아웃 처리 등 공통 에러 핸들링
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn("인증이 만료되었습니다. 다시 로그인해주세요.");
      // 필요 시 로컬 스토리지 지우고 로그인 페이지로 이동하는 로직 추가 가능
      // localStorage.removeItem('accessToken');
      // window.location.href = '/auth/login';
    }
    return Promise.reject(error);
  }
);