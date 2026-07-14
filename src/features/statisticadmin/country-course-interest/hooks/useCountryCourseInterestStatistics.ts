import { useEffect, useMemo, useState } from "react";
import {
  getCourseEnrollmentStatistics,
  getInterestCountries,
  getInterestLectures,
  getInterestSummary,
  toCountryInterestItems,
} from "@/features/services/adminInterestStatistics.service";
import type {
  CountryDetailStat,
  CountryInterestItem,
  CourseInterestItem,
  CourseCompletionStat,
  InterestSummary,
  PopularCountryCourseRank,
} from "../types";

const emptySummary: InterestSummary = {
  totalEnrollmentCount: 0,
  averageCompletionRate: 0,
  riskyCourseCount: 0,
};

export const useCountryCourseInterestStatistics = () => {
  const [summary, setSummary] = useState<InterestSummary>(emptySummary);
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
        setCountryDetails(countriesData);
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

  const countries: CountryInterestItem[] = useMemo(
    () => toCountryInterestItems(countryDetails),
    [countryDetails]
  );

  const courses: CourseInterestItem[] = useMemo(
    () =>
      popularCourseRanks.map((course) => ({
        courseTitle: course.courseTitle,
        enrollmentCount: course.enrollmentCount,
      })),
    [popularCourseRanks]
  );

  return {
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
