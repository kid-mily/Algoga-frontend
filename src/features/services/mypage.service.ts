import { ApiResponse } from "@/lib/api";
import {
  ApiErrorResponse,
  ChangePasswordRequest,
  MyPageUser,
  UpdateProfileRequest,
  UpdateProfileResponse,
  VerifyPasswordRequest,
} from "../mypage/types";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "https://kidmily.kro.kr";

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

const requestMyPageApi = async <T>(
  path: string,
  options: RequestInit = {}
): Promise<T> => {
  const response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    credentials: "include",
    headers: {
      Accept: "application/json",
      ...options.headers,
    },
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

export const getMyPageUser = async (): Promise<MyPageUser> => {
  return requestMyPageApi<MyPageUser>("/api/v1/users/me", {
    method: "GET",
  });
};

export const updateMyProfile = async (
  profileData: UpdateProfileRequest
): Promise<UpdateProfileResponse> => {
  const formData = new FormData();

  formData.append("nickname", profileData.nickname);
  formData.append("phone", profileData.phone);
  formData.append("email", profileData.email);

  if (profileData.profileImage instanceof File) {
    formData.append("profileImage", profileData.profileImage);
  }

  console.log("프로필 수정 요청 FormData:", {
    nickname: formData.get("nickname"),
    phone: formData.get("phone"),
    email: formData.get("email"),
    hasProfileImage: formData.has("profileImage"),
    profileImage: formData.get("profileImage"),
  });

  return requestMyPageApi<UpdateProfileResponse>("/api/v1/users/me", {
    method: "PATCH",
    body: formData,
  });
};

export const verifyMyPassword = async (
  requestData: VerifyPasswordRequest
): Promise<string> => {
  return requestMyPageApi<string>("/api/v1/users/me/verify-password", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestData),
  });
};

export const changeMyPassword = async (
  requestData: ChangePasswordRequest
): Promise<string> => {
  return requestMyPageApi<string>("/api/v1/users/me/password", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestData),
  });
};