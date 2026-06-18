import { ApiResponse } from "@/lib/api";
import {
  MyCoupon,
  MyMileage,
} from "@/features/mypage/benefits/components/types";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "https://kidmily.kro.kr";

const MY_COUPONS_ENDPOINT = "/api/v1/my/coupons";
const MY_MILEAGES_ENDPOINT = "/api/v1/my/mileages";

export class BenefitApiError extends Error {
  status: number;
  code?: string;
  traceId?: string;

  constructor(
    message: string,
    status: number,
    options?: {
      code?: string;
      traceId?: string;
    }
  ) {
    super(message);

    this.name = "BenefitApiError";
    this.status = status;
    this.code = options?.code;
    this.traceId = options?.traceId;
  }
}

interface ErrorResponse {
  code?: string;
  errorCode?: string;
  message?: string;
  traceId?: string;
}

async function requestBenefit<T>(endpoint: string): Promise<T> {
  const response = await fetch(`${API_URL}${endpoint}`, {
    method: "GET",
    credentials: "include",
    headers: {
      Accept: "application/json",
    },
    cache: "no-store",
  });

  const responseText = await response.text();
  const responseData = responseText ? JSON.parse(responseText) : null;

  console.log("쿠폰/마일리지 API 응답:", {
    endpoint,
    status: response.status,
    data: responseData,
  });

  if (!response.ok) {
    const errorData = responseData as ErrorResponse | null;

    throw new BenefitApiError(
      errorData?.message ??
        `쿠폰 및 마일리지 정보를 불러오지 못했습니다. (${response.status})`,
      response.status,
      {
        code: errorData?.errorCode ?? errorData?.code,
        traceId: errorData?.traceId,
      }
    );
  }

  if (
    responseData &&
    typeof responseData === "object" &&
    "data" in responseData
  ) {
    return (responseData as ApiResponse<T>).data;
  }

  return responseData as T;
}

const normalizeCoupons = (data: unknown): MyCoupon[] => {
  if (Array.isArray(data)) {
    return data as MyCoupon[];
  }

  if (
    data &&
    typeof data === "object" &&
    "content" in data &&
    Array.isArray((data as { content?: unknown }).content)
  ) {
    return (data as { content: MyCoupon[] }).content;
  }

  return [];
};

const normalizeMileage = (data: unknown): MyMileage => {
  const mileage = data as Partial<MyMileage> | null;

  return {
    totalMileage: mileage?.totalMileage ?? 0,
    totalEarnedMileage: mileage?.totalEarnedMileage ?? 0,
    totalUsedMileage: mileage?.totalUsedMileage ?? 0,
    histories: Array.isArray(mileage?.histories) ? mileage.histories : [],
  };
};

export async function getMyCoupons(): Promise<MyCoupon[]> {
  const data = await requestBenefit<unknown>(MY_COUPONS_ENDPOINT);
  return normalizeCoupons(data);
}

export async function getMyMileages(): Promise<MyMileage> {
  const data = await requestBenefit<unknown>(MY_MILEAGES_ENDPOINT);
  return normalizeMileage(data);
}