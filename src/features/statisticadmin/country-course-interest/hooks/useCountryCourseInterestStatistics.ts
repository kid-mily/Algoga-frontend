import { useEffect, useMemo, useState } from "react";
import {
  getCountryProfitList,
  getCourseEnrollmentStatistics,
  getInterestCountries,
  getInterestLectures,
  getInterestSummary,
} from "@/features/services/adminInterestStatistics.service";
import type {
  CountryDetailStat,
  CountryInterestItem,
  CourseInterestItem,
  CourseCompletionStat,
  InterestPeriod,
  InterestSummary,
  PopularCountryCourseRank,
} from "../types";
import { getInterestDateRange } from "../utils";

const emptySummary: InterestSummary = {
  totalEnrollmentCount: 0,
  averageCompletionRate: 0,
  riskyCourseCount: 0,
};

export const useCountryCourseInterestStatistics = () => {
  const [period, setPeriod] = useState<InterestPeriod>("month");
  const [summary, setSummary] = useState<InterestSummary>(emptySummary);
  const [countries, setCountries] = useState<CountryInterestItem[]>([]);
  const [countryDetails, setCountryDetails] = useState<CountryDetailStat[]>([]);
  const [courseCompletions, setCourseCompletions] = useState<
    CourseCompletionStat[]
  >([]);
  const [popularCourseRanks, setPopularCourseRanks] = useState<
    PopularCountryCourseRank[]
  >([]);
  const [courseKeyword, setCourseKeyword] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isCourseLoading, setIsCourseLoading] = useState(false);
  const [error, setError] = useState("");

  const query = useMemo(() => getInterestDateRange(period), [period]);

  // 기간 필터를 지원하지 않는 API들은 최초 1회만 조회합니다.
  useEffect(() => {
    const controller = new AbortController();

    const load = async () => {
      try {
        setIsLoading(true);
        setError("");

        const [summaryData, countriesData, lecturesData, enrollmentsData] =
          await Promise.all([
            getInterestSummary(controller.signal),
            getInterestCountries(controller.signal),
            getInterestLectures(controller.signal),
            getCourseEnrollmentStatistics(
              { page: 0, size: 10 },
              controller.signal
            ),
          ]);

        if (controller.signal.aborted) return;

        setSummary(summaryData);
        setCountries(countriesData);
        setPopularCourseRanks(lecturesData.slice(0, 10));
        setCourseCompletions(enrollmentsData);
      } catch (loadError: unknown) {
        if (controller.signal.aborted) return;

        setError(
          loadError instanceof Error
            ? loadError.message
            : "나라·강의 관심도 통계를 불러오지 못했습니다."
        );
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    void load();

    return () => {
      controller.abort();
    };
  }, []);

  // 나라별 상세 통계(country-profit)는 from/to가 필수라 선택된 기간이 바뀔 때마다 다시 조회합니다.
  useEffect(() => {
    const controller = new AbortController();

    const load = async () => {
      try {
        setError("");

        const profitData = await getCountryProfitList(query, controller.signal);

        if (controller.signal.aborted) return;

        setCountryDetails(profitData);
      } catch (loadError: unknown) {
        if (controller.signal.aborted) return;

        setError(
          loadError instanceof Error
            ? loadError.message
            : "나라별 상세 통계를 불러오지 못했습니다."
        );
      }
    };

    void load();

    return () => {
      controller.abort();
    };
  }, [query]);

  useEffect(() => {
    const controller = new AbortController();

    const load = async () => {
      try {
        setIsCourseLoading(true);
        setError("");

        const enrollmentsData = await getCourseEnrollmentStatistics(
          {
            keyword: courseKeyword.trim() || undefined,
            page: 0,
            size: 10,
          },
          controller.signal
        );

        if (controller.signal.aborted) return;

        setCourseCompletions(enrollmentsData);
      } catch (loadError: unknown) {
        if (controller.signal.aborted) return;

        setError(
          loadError instanceof Error
            ? loadError.message
            : "강의별 수강 현황을 불러오지 못했습니다."
        );
      } finally {
        if (!controller.signal.aborted) {
          setIsCourseLoading(false);
        }
      }
    };

    const timeoutId = window.setTimeout(() => {
      void load();
    }, 300);

    return () => {
      window.clearTimeout(timeoutId);
      controller.abort();
    };
  }, [courseKeyword]);

  const courses: CourseInterestItem[] = useMemo(
    () =>
      popularCourseRanks.map((course) => ({
        courseTitle: course.courseTitle,
        enrollmentCount: course.enrollmentCount,
      })),
    [popularCourseRanks]
  );

  return {
    period,
    setPeriod,
    query,
    summary,
    countries,
    courses,
    countryDetails,
    courseCompletions,
    popularCourseRanks,
    courseKeyword,
    setCourseKeyword,
    isLoading,
    isCourseLoading,
    error,
  };
};
