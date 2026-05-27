import axios from "axios";
import { SignupRequest, SignupResponse } from "@/features/auth/types";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const signup = async (data: SignupRequest) => {
  const response = await fetch(`https://kidmily.kro.kr/api/v1/signup`, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json'
    },
  });

  if (!response.ok) {
    let errorMessage='회원가입 실패';
    
    try {
      const errorData = await response.json();
      errorMessage = errorData?.message || errorMessage;
    } catch (e) {
      errorMessage = response.statusText || errorMessage;
    }
    throw new Error(errorMessage);
  }

  // 성공 시 응답 본문이 없을 수도 있으므로 안전하게 파싱
  const text = await response.text();
  return text ? JSON.parse(text) : { success: true };
}