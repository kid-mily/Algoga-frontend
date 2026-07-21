import type {
  AccommodationResponse,
  BookingDetail,
  BundlePaymentPreview,
  BundlePaymentPreviewParams,
  BundlePaymentResponse,
  CreateBookingRequest,
  CreateBundlePaymentRequest,
  CreatePaymentRequest,
  FlightInfo,
  PackageApiItem,
  PackageLoungeDetail,
  PassengerInfo,
  PaymentDetail,
} from "@/features/packagelounge/types";
import { api, type ApiResult, unwrapData } from "@/lib/api";

export async function getPackagesByCountry(
  countryId: string | number,
  signal?: AbortSignal
): Promise<PackageApiItem[]> {
  const response = await api.get<ApiResult<PackageApiItem[]>>(
    `/api/v1/countries/${countryId}/packages`,
    {
      signal,
      skipAuth: true,
      suppressGlobalError: true,
      cache: "no-store",
    }
  );

  return unwrapData(response) ?? [];
}

export async function getPackageDetail(
  packageId: string | number,
  signal?: AbortSignal
): Promise<PackageApiItem> {
  const response = await api.get<ApiResult<PackageApiItem>>(
    `/api/v1/packages/${packageId}`,
    {
      signal,
      skipAuth: true,
      suppressGlobalError: true,
      cache: "no-store",
    }
  );

  return unwrapData(response);
}

export async function getAccommodationDetail(
  accommodationId: string | number,
  signal?: AbortSignal
): Promise<AccommodationResponse> {
  const response = await api.get<ApiResult<AccommodationResponse>>(
    `/api/v1/accommodations/${accommodationId}`,
    {
      signal,
      skipAuth: true,
      suppressGlobalError: true,
      cache: "no-store",
    }
  );

  return unwrapData(response);
}

export async function getPackageLoungeDetail(
  packageId: string | number,
  signal?: AbortSignal
): Promise<PackageLoungeDetail> {
  const packageItem = await getPackageDetail(packageId, signal);
  const accommodation = await getAccommodationDetail(
    packageItem.accommodationId,
    signal
  );

  return { packageItem, accommodation };
}

// POST /bookings 응답의 data는 생성된 예약의 bookingId 하나뿐이다
export async function createBooking(
  payload: CreateBookingRequest,
  signal?: AbortSignal
): Promise<number> {
  const response = await api.post<ApiResult<number>>(
    "/api/v1/bookings",
    payload,
    {
      signal,
      suppressGlobalError: true,
    }
  );

  return unwrapData(response);
}

// GET /bookings/{bookingId} 응답에서 flightInfo/returnFlightInfo/passengerInfo는
// JSON 문자열로 내려오므로 파싱해서 BookingDetail로 변환한다
interface RawBookingDetail
  extends Omit<
    BookingDetail,
    "flightInfo" | "returnFlightInfo" | "passengerInfo"
  > {
  flightInfo: string | null;
  returnFlightInfo: string | null;
  passengerInfo: string | null;
}

function parseJsonField<T>(value: string | null): T | null {
  if (!value) return null;

  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
}

function toBookingDetail(raw: RawBookingDetail): BookingDetail {
  return {
    ...raw,
    flightInfo: parseJsonField<FlightInfo>(raw.flightInfo),
    returnFlightInfo: parseJsonField<FlightInfo>(raw.returnFlightInfo),
    passengerInfo: parseJsonField<PassengerInfo>(raw.passengerInfo),
  };
}

export async function getBookingDetail(
  bookingId: string | number,
  signal?: AbortSignal
): Promise<BookingDetail> {
  const response = await api.get<ApiResult<RawBookingDetail>>(
    `/api/v1/bookings/${bookingId}`,
    {
      signal,
      suppressGlobalError: true,
      cache: "no-store",
    }
  );

  return toBookingDetail(unwrapData(response));
}

// 로그인 유저의 전체 예약 목록. countryId를 넘기면 해당 나라 예약만 필터링된다
export async function getMyBookings(
  countryId?: string | number,
  signal?: AbortSignal
): Promise<BookingDetail[]> {
  const response = await api.get<ApiResult<RawBookingDetail[]>>(
    "/api/v1/bookings/me",
    {
      signal,
      params: countryId !== undefined ? { countryId } : undefined,
      suppressGlobalError: true,
      cache: "no-store",
    }
  );

  const raw = unwrapData(response) ?? [];
  return raw.map(toBookingDetail);
}

// POST /payments 응답의 data는 생성된 결제의 paymentId 하나뿐이다
export async function createPayment(
  payload: CreatePaymentRequest,
  signal?: AbortSignal
): Promise<number> {
  const response = await api.post<ApiResult<number>>(
    "/api/v1/payments",
    payload,
    {
      signal,
      suppressGlobalError: true,
    }
  );

  return unwrapData(response);
}

// PortOne 결제 1회로 예약(패키지) + 강의를 함께 결제한다 (courseIds가 있을 때만 사용)
export async function createBundlePayment(
  payload: CreateBundlePaymentRequest,
  signal?: AbortSignal
): Promise<BundlePaymentResponse> {
  const response = await api.post<ApiResult<BundlePaymentResponse>>(
    "/api/v1/payments/bundle",
    payload,
    {
      signal,
      suppressGlobalError: true,
    }
  );

  return unwrapData(response);
}

// GET /payments/bundle/preview - 통합 결제창을 띄우기 전에 결제 가능 여부(payable)와
// 서버가 계산한 정확한 금액(expectedTotal)을 미리 확인한다 (2026-07-20 PR #584)
// 주의: lib/api.ts의 params는 배열을 반복 쿼리(courseIds=1&courseIds=2)로 못 보내고 콤마 문자열이
// 돼버려서(공통 파일이라 수정 안 함), 프론트가 강의 1개만 지원하는 현재 범위에서만 courseIds[0] 하나로 보낸다
export async function getBundlePaymentPreview(
  { bookingId, courseIds, paymentType, usedMileage, usedCouponId }: BundlePaymentPreviewParams,
  signal?: AbortSignal
): Promise<BundlePaymentPreview> {
  const response = await api.get<ApiResult<BundlePaymentPreview>>(
    "/api/v1/payments/bundle/preview",
    {
      signal,
      suppressGlobalError: true,
      cache: "no-store",
      params: {
        bookingId,
        courseIds: courseIds?.[0],
        paymentType,
        usedMileage,
        usedCouponId: usedCouponId ?? undefined,
      },
    }
  );

  return unwrapData(response);
}

export async function getPaymentDetail(
  paymentId: string | number,
  signal?: AbortSignal
): Promise<PaymentDetail> {
  const response = await api.get<ApiResult<PaymentDetail>>(
    `/api/v1/payments/${paymentId}`,
    {
      signal,
      suppressGlobalError: true,
      cache: "no-store",
    }
  );

  return unwrapData(response);
}

// 로그인 유저의 결제 내역 전체(예약 결제 + 강의 결제 공용, PaymentDetail과 응답 형태 동일).
// bookingId로 paymentId를 역조회할 다른 방법이 없어서, 환불 요청 시 이 목록에서 필터링해 찾는다
export async function getMyPayments(
  signal?: AbortSignal
): Promise<PaymentDetail[]> {
  const response = await api.get<ApiResult<PaymentDetail[]>>(
    "/api/v1/payments/me",
    {
      signal,
      suppressGlobalError: true,
      cache: "no-store",
    }
  );

  return unwrapData(response) ?? [];
}
