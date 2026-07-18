import { useEffect, useMemo, useState } from "react";
import {
  getCountryProfitList,
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

// 강의별 수강 현황과 인기 순위는 같은 interest/lectures 데이터를 표시 컬럼만 다르게 씁니다.
const toCompletionStat = (
  lecture: PopularCountryCourseRank
): CourseCompletionStat => ({
  courseId: lecture.rank,
  courseTitle: lecture.courseTitle,
  enrollmentCount: lecture.enrollmentCount,
  averageProgressRate: lecture.averageProgressRate,
  completionRate: lecture.completionRate,
  averageLearningHours: 0,
  completionStatus: lecture.completionStatus,
});

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
  const [rankKeyword, setRankKeyword] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isCourseLoading, setIsCourseLoading] = useState(false);
  const [error, setError] = useState("");

  const query = useMemo(() => getInterestDateRange(period), [period]);

  // 기간/검색 필터가 없는 지표(요약·나라별 수강자수)는 최초 1회만 조회합니다.
  useEffect(() => {
    const controller = new AbortController();

    const load = async () => {
      try {
        setIsLoading(true);
        setError("");

        const [summaryData, countriesData] = await Promise.all([
          getInterestSummary(controller.signal),
          getInterestCountries(controller.signal),
        ]);

        if (controller.signal.aborted) return;

        setSummary(summaryData);
        setCountries(countriesData);
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

  // 강의별 수강 현황: interest/lectures?search= (강의명·나라 부분 일치)
  useEffect(() => {
    const controller = new AbortController();

    const load = async () => {
      try {
        setIsCourseLoading(true);
        setError("");

        const lectures = await getInterestLectures(
          courseKeyword,
          controller.signal
        );

        if (controller.signal.aborted) return;

        setCourseCompletions(lectures.map(toCompletionStat));
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

  // 인기 국가 강의 순위: interest/lectures?search= (검색 없으면 상위 10개, 검색 시 전체 매칭)
  useEffect(() => {
    const controller = new AbortController();

    const load = async () => {
      try {
        setError("");

        const lectures = await getInterestLectures(
          rankKeyword,
          controller.signal
        );

        if (controller.signal.aborted) return;

        const trimmed = rankKeyword.trim();
        setPopularCourseRanks(trimmed ? lectures : lectures.slice(0, 10));
      } catch (loadError: unknown) {
        if (controller.signal.aborted) return;

        setError(
          loadError instanceof Error
            ? loadError.message
            : "인기 국가 강의 순위를 불러오지 못했습니다."
        );
      }
    };

    const timeoutId = window.setTimeout(() => {
      void load();
    }, 300);

    return () => {
      window.clearTimeout(timeoutId);
      controller.abort();
    };
  }, [rankKeyword]);

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
    rankKeyword,
    setRankKeyword,
    isLoading,
    isCourseLoading,
    error,
  };
};
