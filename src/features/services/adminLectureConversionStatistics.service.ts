import { adminApi, ApiResult, unwrapData } from "@/lib/api";
import { downloadAdminFile } from "@/lib/downloadFile";
import type {
  CountryLectureConversion,
  CourseReservationConversionData,
  LectureConversionFunnelStep,
  LectureConversionQuery,
  LectureConversionRanking,
  LectureReservationSummary,
} from "@/features/statisticadmin/course-reservation-conversion/types";
import { getCountryEvaluation } from "@/features/statisticadmin/course-reservation-conversion/utils";

type RawLectureToTripSummary = {
  lectureBuyers: number;
  completedCount: number;
  completionRate: number;
  convertedCount: number;
  completedConversionRate: number;
  notCompletedConversionRate: number;
  vsNonCompletedMultiple: number;
};

type RawLectureConversion = {
  lectureId: number;
  title: string;
  buyers: number;
  completed: number;
  converted: number;
  conversionRate: number;
};

type RawLectureToTripByLecture = {
  top: RawLectureConversion[];
  bottom: RawLectureConversion[];
};

type RawLectureCountry = {
  countryId: number;
  countryName: string;
  buyers: number;
  completed: number;
  converted: number;
  conversionRate: number;
};

const toNumber = (value: number | null | undefined) => Number(value ?? 0);

const buildFunnel = (raw: RawLectureToTripSummary): LectureConversionFunnelStep[] => {
  const buyers = toNumber(raw.lectureBuyers);
  const completed = toNumber(raw.completedCount);
  const converted = toNumber(raw.convertedCount);
  const completionRate = toNumber(raw.completionRate);
  const overallConversionRate =
    buyers > 0 ? Math.round((converted / buyers) * 1000) / 10 : 0;

  return [
    {
      key: "buyers",
      label: "단과 강의 구매",
      value: buyers,
      percentage: 100,
      caption: "전체 구매자",
      tone: "teal",
    },
    {
      key: "completed",
      label: "완강",
      value: completed,
      percentage: completionRate,
      caption: `전체 대비 ${completionRate}%`,
      tone: "purple",
    },
    {
      key: "reserved",
      label: "패키지 예약 완료",
      value: converted,
      percentage: overallConversionRate,
      caption: `전체 대비 ${overallConversionRate}%`,
      tone: "orange",
    },
  ];
};

const normalizeRanking = (
  items: RawLectureConversion[]
): LectureConversionRanking[] =>
  items.map((item) => ({
    lectureTitle: item.title,
    conversionRate: toNumber(item.conversionRate),
  }));

// 백엔드가 나라별 평가 등급(우수/보통/저조)을 안 내려줘서 conversionRate로 FE에서 직접 분류합니다
const normalizeCountries = (
  items: RawLectureCountry[]
): CountryLectureConversion[] =>
  items.map((item) => {
    const conversionRate = toNumber(item.conversionRate);

    return {
      country: item.countryName,
      lectureBuyers: toNumber(item.buyers),
      completedUsers: toNumber(item.completed),
      reservationUsers: toNumber(item.converted),
      conversionRate,
      evaluation: getCountryEvaluation(conversionRate),
    };
  });

const getSummaryRaw = (query: LectureConversionQuery, signal?: AbortSignal) =>
  adminApi.get<ApiResult<RawLectureToTripSummary>>(
    "/api/v1/admin/stats/lecture-to-trip/summary",
    { params: query, suppressGlobalError: true, signal }
  );

const getByLectureRaw = (query: LectureConversionQuery, signal?: AbortSignal) =>
  adminApi.get<ApiResult<RawLectureToTripByLecture>>(
    "/api/v1/admin/stats/lecture-to-trip/by-lecture",
    { params: query, suppressGlobalError: true, signal }
  );

const getByCountryRaw = (query: LectureConversionQuery, signal?: AbortSignal) =>
  adminApi.get<ApiResult<RawLectureCountry[]>>(
    "/api/v1/admin/stats/lecture-to-trip/by-country",
    { params: query, suppressGlobalError: true, signal }
  );

// 나라별 강의→여행 전환율 — course-reservation-conversion과 coupon-reservation-conversion 양쪽에서 공유합니다.
export const getLectureCountryConversion = async (
  query: LectureConversionQuery,
  signal?: AbortSignal
): Promise<CountryLectureConversion[]> => {
  const response = await getByCountryRaw(query, signal);
  return normalizeCountries(unwrapData(response) ?? []);
};

export const getCourseReservationConversionData = async (
  query: LectureConversionQuery,
  signal?: AbortSignal
): Promise<CourseReservationConversionData> => {
  const [summaryRes, byLectureRes, byCountryRes] = await Promise.all([
    getSummaryRaw(query, signal),
    getByLectureRaw(query, signal),
    getByCountryRaw(query, signal),
  ]);

  const rawSummary = unwrapData(summaryRes);
  const byLecture = unwrapData(byLectureRes);

  const summary: LectureReservationSummary = {
    totalLectureBuyers: toNumber(rawSummary.lectureBuyers),
    completionRate: toNumber(rawSummary.completionRate),
    completedToReservationRate: toNumber(rawSummary.completedConversionRate),
    completedVsIncompleteMultiplier: toNumber(rawSummary.vsNonCompletedMultiple),
  };

  return {
    summary,
    funnel: buildFunnel(rawSummary),
    topLectures: normalizeRanking(byLecture?.top ?? []),
    bottomLectures: normalizeRanking(byLecture?.bottom ?? []),
    countries: normalizeCountries(unwrapData(byCountryRes) ?? []),
  };
};

export const downloadLectureCountryConversionCsv = ({
  from,
  to,
}: LectureConversionQuery) =>
  downloadAdminFile("/api/v1/admin/stats/lecture-to-trip/by-country/csv", {
    params: { from, to },
    filename: "lecture-to-trip-by-country.csv",
  });
