import { adminApi, ApiResult, unwrapData } from "@/lib/api";
import type {
  CountryDetailStat,
  CountryInterestItem,
  InterestQuery,
  InterestSummary,
  PopularCountryCourseRank,
} from "@/features/statisticadmin/country-course-interest/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

type RawInterestSummary = {
  totalEnrollments: number;
  avgCompletionRate: number;
  riskyLectureCount: number;
};

type RawInterestCountry = {
  country: string;
  enrollCount: number;
};

type RawCountryProfit = {
  countryId: number;
  rank?: number;
  countryName: string;
  bookingCount: number;
  grossRevenue: number;
  netRevenue: number;
  refundRate: number;
  balanceConversionRate: number;
  cancelRate: number;
  share: number;
};

type RawInterestLecture = {
  rank: number;
  lectureTitle: string;
  country: string;
  enrollCount: number;
  averageProgressRate: number;
  completionRate: number;
  completionStatus: "NORMAL" | "WARNING" | "RISK";
};

const toNumber = (value: number | null | undefined) => Number(value ?? 0);

const downloadAdminCsv = async (path: string, filename: string) => {
  if (!API_BASE_URL) {
    throw new Error("NEXT_PUBLIC_API_URL이 설정되어 있지 않습니다.");
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: "GET",
    credentials: "include",
    headers: {
      Accept: "text/csv",
    },
  });

  if (!response.ok) {
    throw new Error("CSV 다운로드에 실패했습니다.");
  }

  const blob = await response.blob();
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
};

export const getInterestSummary = async (
  signal?: AbortSignal
): Promise<InterestSummary> => {
  const response = await adminApi.get<ApiResult<RawInterestSummary>>(
    "/api/v1/admin/stats/interest/summary",
    {
      signal,
      suppressGlobalError: true,
    }
  );
  const data = unwrapData(response);

  return {
    totalEnrollmentCount: toNumber(data.totalEnrollments),
    averageCompletionRate: toNumber(data.avgCompletionRate),
    riskyCourseCount: toNumber(data.riskyLectureCount),
  };
};

// 나라별 수강 신청 수 (수강자 내림차순) — 국가별 수강자 수 Top 10 바차트용
export const getInterestCountries = async (
  signal?: AbortSignal
): Promise<CountryInterestItem[]> => {
  const response = await adminApi.get<ApiResult<RawInterestCountry[]>>(
    "/api/v1/admin/stats/interest/countries",
    {
      signal,
      suppressGlobalError: true,
    }
  );

  return unwrapData(response)
    .slice(0, 10)
    .map((country) => ({
      countryName: country.country,
      enrollmentCount: toNumber(country.enrollCount),
    }));
};

// 나라별 예약수·총매출·순매출·환불율·잔금전환율·취소율·점유율 — 국가별 상세 통계 테이블용
// search(국가명 부분 일치)가 있으면 서버 검색으로 걸러진 목록을 받습니다. 빈 값이면 전체 조회.
export const getCountryProfitList = async (
  { from, to, search }: InterestQuery & { search?: string },
  signal?: AbortSignal
): Promise<CountryDetailStat[]> => {
  const response = await adminApi.get<ApiResult<RawCountryProfit[]>>(
    "/api/v1/admin/stats/country-profit",
    {
      params: { from, to, search: search?.trim() || undefined },
      signal,
      suppressGlobalError: true,
    }
  );

  // 순위는 백엔드가 전체 기준으로 내려주면 그 값을 쓰고(재계산 금지), 없으면 응답 순서로 대체합니다.
  return unwrapData(response).map((country, index) => ({
    rank: toNumber(country.rank) || index + 1,
    countryName: country.countryName,
    bookingCount: toNumber(country.bookingCount),
    grossRevenue: toNumber(country.grossRevenue),
    netRevenue: toNumber(country.netRevenue),
    refundRate: toNumber(country.refundRate),
    balanceConversionRate: toNumber(country.balanceConversionRate),
    cancelRate: toNumber(country.cancelRate),
    share: toNumber(country.share),
  }));
};

// search: 강의명 또는 나라명 부분 일치 (백엔드 배포 후 적용). 빈 값이면 전체 조회.
export const getInterestLectures = async (
  search?: string,
  signal?: AbortSignal
): Promise<PopularCountryCourseRank[]> => {
  const trimmed = search?.trim();
  const response = await adminApi.get<ApiResult<RawInterestLecture[]>>(
    "/api/v1/admin/stats/interest/lectures",
    {
      params: trimmed ? { search: trimmed } : undefined,
      signal,
      suppressGlobalError: true,
    }
  );

  return unwrapData(response).map((lecture) => ({
    rank: toNumber(lecture.rank),
    courseTitle: lecture.lectureTitle,
    countryName: lecture.country,
    enrollmentCount: toNumber(lecture.enrollCount),
    averageProgressRate: toNumber(lecture.averageProgressRate),
    completionRate: toNumber(lecture.completionRate),
    completionStatus: lecture.completionStatus,
  }));
};

export const downloadCountryProfitCsv = async ({
  from,
  to,
  search,
}: InterestQuery & { search?: string }) => {
  const params = new URLSearchParams({ from, to });

  const trimmed = search?.trim();
  if (trimmed) {
    params.set("search", trimmed);
  }

  await downloadAdminCsv(
    `/api/v1/admin/stats/country-profit/csv?${params.toString()}`,
    "country-profit.csv"
  );
};

export const downloadInterestLecturesCsv = async (search = "") => {
  const trimmed = search.trim();
  const query = trimmed ? `?search=${encodeURIComponent(trimmed)}` : "";

  await downloadAdminCsv(
    `/api/v1/admin/stats/interest/lectures/csv${query}`,
    "interest-lectures.csv"
  );
};

// 관심도 나라별 수강 수 CSV. search(나라명 부분 일치)가 있으면 함께 보냅니다.
export const downloadInterestCountriesCsv = async (search = "") => {
  const trimmed = search.trim();
  const query = trimmed ? `?search=${encodeURIComponent(trimmed)}` : "";

  await downloadAdminCsv(
    `/api/v1/admin/stats/interest/countries/csv${query}`,
    "interest-countries.csv"
  );
};
