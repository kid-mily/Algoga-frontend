import { adminApi, ApiResult, unwrapData } from "@/lib/api";
import type {
  CountryDetailStat,
  CourseCompletionStat,
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

type RawCourseEnrollment = {
  courseId: number;
  courseTitle: string;
  country: string;
  studentCount: number;
  averageProgressRate: number;
  completionRate: number;
  averageWatchHours: number;
  completionStatus: "NORMAL" | "WARNING" | "RISK";
};

type RawCourseEnrollmentPage = {
  totalElements: number;
  page: number;
  size: number;
  content: RawCourseEnrollment[];
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
export const getCountryProfitList = async (
  { from, to }: InterestQuery,
  signal?: AbortSignal
): Promise<CountryDetailStat[]> => {
  const response = await adminApi.get<ApiResult<RawCountryProfit[]>>(
    "/api/v1/admin/stats/country-profit",
    {
      params: { from, to },
      signal,
      suppressGlobalError: true,
    }
  );

  return unwrapData(response).map((country, index) => ({
    rank: index + 1,
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

export const getInterestLectures = async (
  signal?: AbortSignal
): Promise<PopularCountryCourseRank[]> => {
  const response = await adminApi.get<ApiResult<RawInterestLecture[]>>(
    "/api/v1/admin/stats/interest/lectures",
    {
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

export const getCourseEnrollmentStatistics = async (
  query: { keyword?: string; page?: number; size?: number } = {},
  signal?: AbortSignal
): Promise<CourseCompletionStat[]> => {
  const response = await adminApi.get<ApiResult<RawCourseEnrollmentPage>>(
    "/api/v1/admin/statistics/courses/enrollment",
    {
      params: {
        keyword: query.keyword,
        page: query.page ?? 0,
        size: query.size ?? 10,
      },
      signal,
      suppressGlobalError: true,
    }
  );

  return unwrapData(response).content.map((course) => ({
    courseId: toNumber(course.courseId),
    courseTitle: course.courseTitle,
    countryName: course.country,
    enrollmentCount: toNumber(course.studentCount),
    averageProgressRate: toNumber(course.averageProgressRate),
    completionRate: toNumber(course.completionRate),
    averageWatchHours: toNumber(course.averageWatchHours),
    completionStatus: course.completionStatus,
  }));
};

export const downloadCountryProfitCsv = async ({ from, to }: InterestQuery) => {
  const params = new URLSearchParams({ from, to });

  await downloadAdminCsv(
    `/api/v1/admin/stats/country-profit/csv?${params.toString()}`,
    "country-profit.csv"
  );
};

export const downloadInterestLecturesCsv = async () => {
  await downloadAdminCsv(
    "/api/v1/admin/stats/interest/lectures/csv",
    "interest-lectures.csv"
  );
};

export const downloadCourseEnrollmentCsv = async (keyword = "") => {
  const query = keyword ? `?keyword=${encodeURIComponent(keyword)}` : "";

  await downloadAdminCsv(
    `/api/v1/admin/statistics/courses/enrollment/csv${query}`,
    "course-enrollment-statistics.csv"
  );
};
