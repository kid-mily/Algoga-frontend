import { adminApi, ApiResult, unwrapData } from "@/lib/api";
import { downloadAdminFile } from "@/lib/downloadFile";
import {
  BalanceQuery,
  BalanceSummary,
  CountryBalanceConversion,
  OutstandingReservation,
  RecoveryRatePoint,
} from "@/features/statisticadmin/balance/types";
import { formatDisplayDate } from "@/features/statisticadmin/balance/utils";

type RawBalanceSummary = {
  balanceConversionRate: number;
  outstandingAmount: number;
  depositPaidCount: number;
  fullPaidCount: number;
  atRiskCount: number;
  ddayImminentCount: number;
};

type RawRecoveryPoint = {
  daysSinceDeposit: number;
  cumulativePaidRate: number;
};

type RawCountryConversion = {
  countryId: number;
  countryName: string;
  depositPaidCount: number;
  fullPaidCount: number;
  conversionRate: number;
};

type RawBalanceAging = {
  curve: RawRecoveryPoint[];
  byCountry: RawCountryConversion[];
};

type RawOutstandingReservation = {
  bookingNumber: string;
  userName: string;
  productName: string;
  balanceAmount: number;
  depositPaidDate: string;
  daysElapsed: number;
  checkInDate: string;
  dday: number;
};

const normalizeBalanceSummary = (raw: RawBalanceSummary): BalanceSummary => ({
  conversionRate: raw.balanceConversionRate ?? 0,
  outstandingAmount: raw.outstandingAmount ?? 0,
  depositPaidCount: raw.depositPaidCount ?? 0,
  fullPaidCount: raw.fullPaidCount ?? 0,
  atRiskCount: raw.atRiskCount ?? 0,
  dueSoonCount: raw.ddayImminentCount ?? 0,
});

const normalizeRecoveryRates = (
  curve: RawRecoveryPoint[]
): RecoveryRatePoint[] =>
  curve.map((point) => ({
    day: point.daysSinceDeposit ?? 0,
    rate: point.cumulativePaidRate ?? 0,
  }));

const normalizeCountryConversions = (
  byCountry: RawCountryConversion[]
): CountryBalanceConversion[] =>
  byCountry.map((item) => ({
    countryName: item.countryName,
    conversionRate: item.conversionRate ?? 0,
    depositPaidCount: item.depositPaidCount ?? 0,
    fullPaidCount: item.fullPaidCount ?? 0,
  }));

const normalizeOutstandingReservation = (
  raw: RawOutstandingReservation
): OutstandingReservation => ({
  bookingNumber: raw.bookingNumber,
  customerName: raw.userName,
  productName: raw.productName,
  outstandingAmount: raw.balanceAmount ?? 0,
  contractDate: formatDisplayDate(raw.depositPaidDate),
  elapsedDays: raw.daysElapsed ?? 0,
  checkInDate: formatDisplayDate(raw.checkInDate),
  dDay: raw.dday ?? 0,
});

// 잔금 전환율/미수금/D-day 임박 등 잔금 관리 요약 지표
// 문서엔 파라미터가 없지만 실제로는 'from'이 없으면 400(GLOBAL_002)을 반환해서 같이 보냅니다.
export const getBalanceSummary = async (
  { from, to }: BalanceQuery,
  signal?: AbortSignal
): Promise<BalanceSummary> => {
  const response = await adminApi.get<ApiResult<RawBalanceSummary>>(
    "/api/v1/admin/stats/balance/summary",
    {
      params: { from, to },
      suppressGlobalError: true,
      signal,
    }
  );

  return normalizeBalanceSummary(unwrapData(response));
};

// 계약금 후 경과일별 잔금 납부율 곡선 및 나라별 잔금 전환율
export const getBalanceAging = async (
  { from, to }: BalanceQuery,
  signal?: AbortSignal
): Promise<{
  recoveryRates: RecoveryRatePoint[];
  countryConversions: CountryBalanceConversion[];
}> => {
  const response = await adminApi.get<ApiResult<RawBalanceAging>>(
    "/api/v1/admin/stats/balance/aging",
    {
      params: { from, to },
      suppressGlobalError: true,
      signal,
    }
  );
  const data = unwrapData(response);

  return {
    recoveryRates: normalizeRecoveryRates(data?.curve ?? []),
    countryConversions: normalizeCountryConversions(data?.byCountry ?? []),
  };
};

// 미납 예약 목록. search(고객명 또는 상품명 부분 일치)가 있으면 서버 검색으로 함께 보냅니다.
export const getUnpaidBookings = async (
  { from, to, search }: BalanceQuery & { search?: string },
  signal?: AbortSignal
): Promise<OutstandingReservation[]> => {
  const trimmed = search?.trim();
  const response = await adminApi.get<ApiResult<RawOutstandingReservation[]>>(
    "/api/v1/admin/stats/balance/unpaid",
    {
      params: { from, to, search: trimmed || undefined },
      suppressGlobalError: true,
      signal,
    }
  );

  return (unwrapData(response) ?? []).map(normalizeOutstandingReservation);
};

export const downloadUnpaidBookingsCsv = ({
  from,
  to,
  search,
}: BalanceQuery & { search?: string }) =>
  downloadAdminFile("/api/v1/admin/stats/balance/unpaid/csv", {
    params: { from, to, search: search?.trim() },
    filename: "unpaid-bookings.csv",
  });
