// import { api, ApiResponse, unwrapData } from "@/lib/api";
// import { CreateLecturePaymentPayload } from "../payment/types";

// export const createLecturePayment = async (
//   payload: CreateLecturePaymentPayload
// ) => {
//   const response = await api.post<ApiResponse<unknown>>(
//     "/api/v1/payments/lecture",
//     payload,
//     {
//       suppressGlobalError: true,
//     }
//   );

//   return unwrapData(response);
// };

// export const getMyPayments = async () => {
//   const response = await api.get<ApiResponse<unknown[]>>("/api/v1/payments/me", {
//     params: { t: Date.now() },
//     suppressGlobalError: true,    // 결제 실패 시 /error/500으로 튕기지 않고, 결제 화면에서 에러 메시지 보여주기
//   });

//   return unwrapData(response);
// };

// 결제 요청 데이터 타입
export interface LecturePaymentRequest {
  courseId: number;
  amount: number;
  usedMileage: number;
  usedCouponId: number | null;
  portonePaymentId: string | null;
}

// 결제 생성 성공 응답 타입
export interface LecturePaymentResponse {
  paymentId?: number;
  paymentStatus?: string;
}

// 내 결제 내역 타입
// 실제 API 응답 필드에 맞춰 필요한 속성을 추가
export interface MyPayment {
  paymentId: number;
  courseId?: number;
  amount?: number;
  paymentStatus?: string;
  createdAt?: string;
}

// 백엔드 오류 응답 타입
interface PaymentErrorResponse {
  timestamp?: string;
  status?: number;
  code?: string;
  errorCode?: string;
  message?: string;
  traceId?: string;
}

// 결제 API 전용 오류
export class LecturePaymentError extends Error {
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

    this.name = "LecturePaymentError";
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

// API 기본 주소
const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "https://kidmily.kro.kr";

// 공통 응답 처리
const requestPaymentApi = async <T>(
  path: string,
  options?: RequestInit
): Promise<T> => {
  const response = await fetch(`${BASE_URL}${path}`, {
    ...options,

    // 인증 쿠키를 요청에 포함
    credentials: "include",

    headers: {
      Accept: "application/json",
      ...(options?.body && {
        "Content-Type": "application/json",
      }),
      ...options?.headers,
    },

    // 브라우저 캐시를 사용하지 않고 최신 데이터 요청
    cache: "no-store",
  });

  const responseText = await response.text();
  const responseData = parseResponse(responseText);

  console.log("결제 API 응답:", {
    path,
    status: response.status,
    statusText: response.statusText,
    data: responseData,
  });

  if (!response.ok) {
    const errorData =
      typeof responseData === "object" && responseData !== null
        ? (responseData as PaymentErrorResponse)
        : null;

    throw new LecturePaymentError(
      errorData?.message ??
        `결제 API 요청에 실패했습니다. (${response.status})`,
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
    return (responseData as { data: T }).data;
  }

  return responseData as T;
};

// 단과 강의 결제 생성
export const createLecturePayment = async (
  paymentData: LecturePaymentRequest
): Promise<LecturePaymentResponse | null> => {
  return requestPaymentApi<LecturePaymentResponse | null>(
    "/api/v1/payments/lecture",
    {
      method: "POST",
      body: JSON.stringify(paymentData),
    }
  );
};

// 내 결제 내역 조회
export const getMyPayments = async (): Promise<MyPayment[]> => {
  return requestPaymentApi<MyPayment[]>("/api/v1/payments/me", {
    method: "GET",
  });
};