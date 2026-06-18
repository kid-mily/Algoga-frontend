import { api, ApiResponse, unwrapData } from "@/lib/api";
import type {
  ApiErrorResponse,
  ChangePasswordRequest,
  MyPageData,
  MyPageUser,
  UpdateProfileRequest,
  UpdateProfileResponse,
  VerifyPasswordRequest,
} from "@/features/mypage/types";
import { getMyCoupons } from "@/features/services/myBenefit.service";
import { getMyPayments } from "@/features/services/SinglePayment.service";
import { getMe } from "@/features/services/user.service";

export class MyPageApiError extends Error {
  status?: number;
  code?: string;
  traceId?: string;
  responseData?: ApiErrorResponse;

  constructor(responseData: ApiErrorResponse) {
    super(responseData.message || "마이페이지 요청에 실패했습니다.");

    this.name = "MyPageApiError";
    this.status = responseData.status;
    this.code = responseData.errorCode || responseData.code;
    this.traceId = responseData.traceId;
    this.responseData = responseData;
  }
}

const toMyPageUser = (user: Partial<MyPageUser>): MyPageUser => ({
  username: user.username ?? "",
  password: user.password ?? "",
  name: user.name ?? "",
  nickname: user.nickname ?? user.name ?? "",
  email: user.email ?? "",
  profileImageUrl: user.profileImageUrl ?? null,
  phone: user.phone ?? "",
  gender: user.gender ?? "",
  birthDate: user.birthDate ?? "",
  personalCode: user.personalCode ?? "",
});

export async function getMyPageUser(): Promise<MyPageUser> {
  const user = await getMe();

  return toMyPageUser(user);
}

export async function getMyPageData(): Promise<MyPageData> {
  const [user, coupons, payments] = await Promise.all([
    getMyPageUser(),

    // 쿠폰 API가 실패해도 마이페이지 전체는 표시
    getMyCoupons().catch((error) => {
      console.error("쿠폰 조회 실패:", error);
      return [];
    }),

    // 결제 내역 API가 실패해도 마이페이지 전체는 표시
    getMyPayments().catch((error) => {
      console.error("결제 내역 조회 실패:", error);
      return [];
    }),
  ]);

  return {
    user,

    summary: {
      // TODO: 수강 내역 API 연결 후 실제 개수로 변경
      courseCount: 0,

      reservationCount: Array.isArray(payments) ? payments.length : 0,

      couponCount: Array.isArray(coupons) ? coupons.length : 0,
    },
  };
}

export async function verifyMyPassword(
  payload: VerifyPasswordRequest
): Promise<void> {
  try {
    await api.post<ApiResponse<unknown>>(
      "/api/v1/users/me/verify-password",
      payload,
      {
        suppressGlobalError: true,
      }
    );
  } catch (error) {
    throw error instanceof Error
      ? error
      : new Error("비밀번호 확인에 실패했습니다.");
  }
}

export async function updateMyProfile(
  payload: UpdateProfileRequest
): Promise<UpdateProfileResponse> {
  const formData = new FormData();

  formData.append("nickname", payload.nickname);
  formData.append("phone", payload.phone);
  formData.append("email", payload.email);

  if (payload.profileImage) {
    formData.append("profileImage", payload.profileImage);
  }

  const response = await api.patch<ApiResponse<UpdateProfileResponse>>(
    "/api/v1/users/me",
    formData,
    {
      suppressGlobalError: true,
    }
  );

  return unwrapData(response);
}

export async function changeMyPassword(
  payload: ChangePasswordRequest
): Promise<void> {
  await api.patch<ApiResponse<unknown>>(
    "/api/v1/users/me/password",
    payload,
    {
      suppressGlobalError: true,
    }
  );
}