import type {
  ItineraryResponse,
  ItinerarySummaryResponse,
  PurchasedTripResponse,
  RecommendItineraryRequest,
} from "@/features/aischedule/types";
import { api, type ApiResult, unwrapData } from "@/lib/api";

// AI 생성이라 수 초~수십 초 걸릴 수 있어 기본 15초보다 넉넉한 타임아웃을 준다
const RECOMMEND_TIMEOUT_MS = 60000;

export async function recommendItinerary(
  payload: RecommendItineraryRequest,
  signal?: AbortSignal
): Promise<ItineraryResponse> {
  const response = await api.post<ApiResult<ItineraryResponse>>(
    "/api/v1/itineraries/recommend",
    payload,
    {
      signal,
      suppressGlobalError: true,
      timeoutMs: RECOMMEND_TIMEOUT_MS,
    }
  );

  return unwrapData(response);
}

// tripType=BOOKING 선택지 - 로그인 유저의 예약 중 추천에 쓸 수 있는 것만 최신순
export async function getPurchasedTrips(
  signal?: AbortSignal
): Promise<PurchasedTripResponse[]> {
  const response = await api.get<ApiResult<PurchasedTripResponse[]>>(
    "/api/v1/itineraries/purchased-trips",
    {
      signal,
      suppressGlobalError: true,
      cache: "no-store",
    }
  );

  return unwrapData(response) ?? [];
}

// 내 일정 추천 이력 목록 (최신순, slots 없이 가벼움)
export async function getMyItineraries(
  signal?: AbortSignal
): Promise<ItinerarySummaryResponse[]> {
  const response = await api.get<ApiResult<ItinerarySummaryResponse[]>>(
    "/api/v1/itineraries",
    {
      signal,
      suppressGlobalError: true,
      cache: "no-store",
    }
  );

  return unwrapData(response) ?? [];
}

// 일정 추천 상세 (본인 소유만 조회 가능, 아니면 404 ITN_004)
export async function getItineraryDetail(
  itineraryId: string | number,
  signal?: AbortSignal
): Promise<ItineraryResponse> {
  const response = await api.get<ApiResult<ItineraryResponse>>(
    `/api/v1/itineraries/${itineraryId}`,
    {
      signal,
      suppressGlobalError: true,
      cache: "no-store",
    }
  );

  return unwrapData(response);
}
