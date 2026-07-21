// AI 일정 추천 도메인 타입 (POST /itineraries/recommend 등)
// 서버 전송은 code(enum name), 화면 표시는 label. 라벨 맵은 프론트 상수.

// 여행 유형: 프론트가 진입 맥락으로 명시 분기한다
export type TripType = "BOOKING" | "PACKAGE" | "FREE";

export const TRIP_TYPE_LABEL: Record<TripType, string> = {
  BOOKING: "구매한 패키지",
  PACKAGE: "전체 패키지",
  FREE: "자유 여행",
};

// 여행 취향 (다중선택, 최소 1개)
export type TravelPreference =
  | "NATURE"
  | "FOOD"
  | "ACTIVITY"
  | "RELAXATION"
  | "SHOPPING"
  | "CULTURE"
  | "PHOTO";

export const PREFERENCE_LABEL: Record<TravelPreference, string> = {
  NATURE: "자연",
  FOOD: "맛집",
  ACTIVITY: "액티비티",
  RELAXATION: "휴양",
  SHOPPING: "쇼핑",
  CULTURE: "문화",
  PHOTO: "사진",
};

export const PREFERENCE_OPTIONS = Object.keys(
  PREFERENCE_LABEL
) as TravelPreference[];

// 여행 목적 (단일선택)
export type TravelPurpose =
  | "RELAXATION"
  | "SIGHTSEEING"
  | "GOURMET"
  | "ACTIVITY"
  | "ANNIVERSARY"
  | "ETC";

export const PURPOSE_LABEL: Record<TravelPurpose, string> = {
  RELAXATION: "휴양",
  SIGHTSEEING: "관광",
  GOURMET: "미식",
  ACTIVITY: "액티비티",
  ANNIVERSARY: "기념일",
  ETC: "기타",
};

export const PURPOSE_OPTIONS = Object.keys(PURPOSE_LABEL) as TravelPurpose[];

// 동행자 (단일선택)
export type Companion = "ALONE" | "COUPLE" | "FRIENDS" | "FAMILY" | "WITH_KIDS";

export const COMPANION_LABEL: Record<Companion, string> = {
  ALONE: "혼자",
  COUPLE: "연인",
  FRIENDS: "친구",
  FAMILY: "가족",
  WITH_KIDS: "아이동반",
};

export const COMPANION_OPTIONS = Object.keys(COMPANION_LABEL) as Companion[];

// POST /itineraries/recommend 요청 바디.
// tripType별로 bookingId | packageId | (destination+startDate+endDate) 중 하나만 채운다
export interface RecommendItineraryRequest {
  tripType: TripType;
  bookingId?: number;
  packageId?: number;
  destination?: string;
  startDate?: string;
  endDate?: string;
  preferences: TravelPreference[];
  purpose: TravelPurpose;
  companion: Companion;
  budget: number;
  headcount: number;
}

export interface LabeledCode<T extends string> {
  code: T;
  label: string;
}

export interface EstimatedCost {
  packagePrice: number | null;
  foodCost: number;
  totalEstimated: number;
}

export interface ItinerarySlot {
  time: string;
  activity: string;
  place: string;
  memo: string | null;
}

export interface ItineraryDay {
  day: number;
  date: string;
  slots: ItinerarySlot[];
}

// GET /itineraries/{id} 및 POST /itineraries/recommend 응답
export interface ItineraryResponse {
  itineraryId: number;
  destination: string;
  startDate: string;
  endDate: string;
  totalDays: number;
  headcount: number;
  packageTrip: boolean;
  purpose: TravelPurpose;
  purposeLabel: string;
  companion: Companion;
  companionLabel: string;
  preferences: LabeledCode<TravelPreference>[];
  budget: number;
  estimatedCost: EstimatedCost;
  days: ItineraryDay[];
  comment: string;
}

// GET /itineraries 목록 항목 (slots 없이 가벼움)
export interface ItinerarySummaryResponse {
  itineraryId: number;
  destination: string;
  startDate: string;
  endDate: string;
  totalDays: number;
  packageTrip: boolean;
  purpose: TravelPurpose;
  purposeLabel: string;
  estimatedTotalCost: number;
  createdAt: string;
}

// 예약 상태 - PENDING/DEPOSIT_PAID/FULL_PAID만 구매 목록에 내려옴
// (CANCEL_REQUESTED/REFUNDED는 서버가 이미 제외)
export type PurchasedTripStatus = "PENDING" | "DEPOSIT_PAID" | "FULL_PAID";

// GET /itineraries/purchased-trips 응답
export interface PurchasedTripResponse {
  bookingId: number;
  destination: string;
  accommodationName: string | null;
  startDate: string;
  endDate: string;
  nights: number;
  price: number;
  status: PurchasedTripStatus;
  bookingNumber: string;
}

// 에러 응답의 errorCode
export type ItineraryErrorCode =
  | "ITN_001"
  | "ITN_002"
  | "ITN_003"
  | "ITN_004"
  | "ITN_005"
  | "ITN_006"
  | "ITN_007";
