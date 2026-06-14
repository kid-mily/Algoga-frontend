import { ApiResponse } from "@/lib/api";
import { ApiErrorResponse, ChangePasswordRequest, MyPageUser, UpdateProfileRequest, UpdateProfileResponse, VerifyPasswordRequest } from "../mypage/types";


const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "https://kidmily.kro.kr";

// 마이페이지 API 오류
export class MyPageApiError extends Error {
  status: number;
  code?: string;
  traceId?: string;
  responseData?: unknown;

  constructor(
    message: string,
    status: number,
    options?: {
      code?: string;
      traceId?: string;
      responseData?: unknown;
    }
  ) {
    super(message);

    this.name = "MyPageApiError";
    this.status = status;
    this.code = options?.code;
    this.traceId = options?.traceId;
    this.responseData = options?.responseData;
  }
}

// 문자열 응답을 JSON으로 변환
const parseResponse = (responseText: string): unknown => {
  if (!responseText) {
    return null;
  }

  try {
    return JSON.parse(responseText);
  } catch {
    return responseText;
  }
};

// 마이페이지 API 공통 요청 함수
const requestMyPageApi = async <T>(
  path: string,
  options: RequestInit = {}
): Promise<T> => {
  const response = await fetch(`${BASE_URL}${path}`, {
    ...options,

    // 로그인 쿠키를 API 요청에 포함
    credentials: "include",

    headers: {
      Accept: "application/json",
      ...options.headers,
    },

    // 사용자 정보는 최신 상태가 중요하므로 캐시하지 않음
    cache: "no-store",
  });

  const responseText = await response.text();
  const responseData = parseResponse(responseText);

  console.log("마이페이지 API 응답:", {
    path,
    status: response.status,
    data: responseData,
  });

  if (!response.ok) {
    const errorData =
      typeof responseData === "object" && responseData !== null
        ? (responseData as ApiErrorResponse)
        : null;

    throw new MyPageApiError(
      errorData?.message ??
        `마이페이지 요청에 실패했습니다. (${response.status})`,
      response.status,
      {
        code: errorData?.errorCode ?? errorData?.code,
        traceId: errorData?.traceId,
        responseData,
      }
    );
  }

  if (
    typeof responseData === "object" &&
    responseData !== null &&
    "data" in responseData
  ) {
    return (responseData as ApiResponse<T>).data;
  }

  return responseData as T;
};

// 로그인한 사용자 정보 조회
export const getMyPageUser = async (): Promise<MyPageUser> => {
  return requestMyPageApi<MyPageUser>("/api/v1/users/me", {
    method: "GET",
  });
};

// 프로필 수정
export const updateMyProfile = async (
  profileData: UpdateProfileRequest
): Promise<UpdateProfileResponse> => {
  const formData = new FormData();

  formData.append("nickname", profileData.nickname);
  formData.append("phone", profileData.phone);
  formData.append("email", profileData.email);

  // 파일이 있을 때만 profileImage 필드를 추가
  if (profileData.profileImage) {
    formData.append("profileImage", profileData.profileImage);
  }

  return requestMyPageApi<UpdateProfileResponse>(
    "/api/v1/users/me",
    {
      method: "PATCH",
      body: formData,
    }
  );
};

// 현재 비밀번호 확인
export const verifyMyPassword = async (
  requestData: VerifyPasswordRequest
): Promise<string> => {
  return requestMyPageApi<string>(
    "/api/v1/users/me/verify-password",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestData),
    }
  );
};

// 비밀번호 변경
export const changeMyPassword = async (
  requestData: ChangePasswordRequest
): Promise<string> => {
  return requestMyPageApi<string>(
    "/api/v1/users/me/password",
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestData),
    }
  );
};