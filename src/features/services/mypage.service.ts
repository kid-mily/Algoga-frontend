import { api, ApiResponse, unwrapData } from "@/lib/api";
import type {
  ApiErrorResponse,
  ChangePasswordRequest,
  MyPageData,
  MyPageUser,
  UpdateProfileRequest,
  UpdateProfileResponse,
  VerifyEmailCodeRequest,
} from "@/features/mypage/types";
import { getMyCoupons } from "@/features/services/myBenefit.service";
import { getMyBookings } from "@/features/services/package.service";
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

type MyCoursesCountResponse =
  | {
      content?: unknown[];
      totalElements?: number;
      totalCount?: number;
      total?: number;
    }
  | unknown[];

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

const getMyCourseCount = async (headers?: HeadersInit): Promise<number> => {
  const response = await api.get<ApiResponse<MyCoursesCountResponse>>(
    "/api/v1/my/courses",
    {
      params: {
        page: 0,
        size: 1,
      },
      cache: "no-store",
      headers,
      suppressGlobalError: true,
    }
  );

  const data = unwrapData(response);

  if (Array.isArray(data)) {
    return data.length;
  }

  if (typeof data.totalElements === "number") {
    return data.totalElements;
  }

  if (typeof data.totalCount === "number") {
    return data.totalCount;
  }

  if (typeof data.total === "number") {
    return data.total;
  }

  if (Array.isArray(data.content)) {
    return data.content.length;
  }

  return 0;
};

export async function getMyPageUser(
  headers?: HeadersInit
): Promise<MyPageUser> {
  const user = await getMe(undefined, headers);

  if (!user) {
    throw new MyPageApiError({
      status: 401,
      message: "로그인이 필요한 서비스입니다.",
    });
  }

  return toMyPageUser(user);
}

export async function getMyPageData(
  options?: {
    includeReservationCount?: boolean;
    headers?: HeadersInit;
  }
): Promise<MyPageData> {
  // 예약 목록 페이지(ReservationPage)가 같은 GET /bookings/me를 자체적으로 또 호출하므로,
  // 그 페이지에서까지 여기서 중복 호출하면 동시 요청 2개가 나가 백엔드에서 500이 났다.
  // 그 숫자를 실제로 보여주는 /mypage 화면에서만 이 요청을 같이 보낸다.
  const includeReservationCount = options?.includeReservationCount ?? true;
  const headers = options?.headers;

  const [user, coupons, courseCount, bookings] = await Promise.all([
    getMyPageUser(headers),

    getMyCoupons(headers).catch((error) => {
      console.error("쿠폰 조회 실패:", error);
      return [];
    }),

    getMyCourseCount(headers).catch((error) => {
      console.error("수강 강의 개수 조회 실패:", error);
      return 0;
    }),

    includeReservationCount
      ? getMyBookings(undefined, undefined, headers).catch((error) => {
          console.error("예약 내역 조회 실패:", error);
          return [];
        })
      : Promise.resolve([]),
  ]);

  return {
    user,
    summary: {
      courseCount,
      reservationCount: bookings.filter((booking) => {
        const status = booking.status.trim().toUpperCase();

        return ![
          "PENDING",
          "EXPIRED",
          "CANCELED",
          "CANCELLED",
          "CANCEL_REQUESTED",
          "REFUNDED",
        ].includes(status);
      }).length,
      couponCount: Array.isArray(coupons) ? coupons.length : 0,
    },
  };
}

// 정보 수정 진입 전 이메일 인증코드 발송 (로그인 유저 본인 이메일로 발송)
export async function sendMyPageAuthCode(): Promise<void> {
  try {
    await api.post<ApiResponse<unknown>>(
      "/api/v1/users/me/email/send-code",
      undefined,
      {
        suppressGlobalError: true,
      }
    );
  } catch (error) {
    throw error instanceof Error
      ? error
      : new Error("인증번호 발송에 실패했습니다.");
  }
}

// 정보 수정 진입 전 이메일 인증코드 검증
export async function verifyMyPageAuthCode(
  payload: VerifyEmailCodeRequest
): Promise<void> {
  try {
    await api.post<ApiResponse<unknown>>(
      "/api/v1/users/me/email/verify",
      payload,
      {
        suppressGlobalError: true,
      }
    );
  } catch (error) {
    throw error instanceof Error
      ? error
      : new Error("인증번호 확인에 실패했습니다.");
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

// 회원 탈퇴 - 이메일 인증(sendMyPageAuthCode/verifyMyPageAuthCode)이 30분 이내 선행되어야 함
export async function withdrawMyAccount(): Promise<void> {
  await api.delete<ApiResponse<unknown>>("/api/v1/users/me", {
    suppressGlobalError: true,
  });
}
