import {
  ChangeEvent,
  FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { getCourseEnrollmentStatistics } from "@/features/services/adminCourseEnrollmentStatistics.service";
import { CourseEnrollmentStatistic } from "../types";
import {
  formatCourseEnrollmentError,
  getCourseEnrollmentSummary,
} from "../utils";

const PAGE_SIZE = 10;

export const useCourseEnrollmentStatistics = () => {
  const [courses, setCourses] = useState<CourseEnrollmentStatistic[]>([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    const load = async () => {
      try {
        setIsLoading(true);
        setError("");

        const data = await getCourseEnrollmentStatistics({
          keyword: searchKeyword,
          page: currentPage,
          size: PAGE_SIZE,
          signal: controller.signal,
        });

        if (controller.signal.aborted) return;

        setCourses(data.content);
        setCurrentPage(data.page);
        setTotalPages(data.totalPages);
        setTotalElements(data.totalElements);
      } catch (loadError: unknown) {
        if (controller.signal.aborted) return;

        setCourses([]);
        setTotalPages(1);
        setTotalElements(0);
        setError(
          formatCourseEnrollmentError(
            loadError,
            "수강률 분석 데이터를 불러오지 못했습니다."
          )
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
  }, [currentPage, searchKeyword]);

  const summary = useMemo(
    () => getCourseEnrollmentSummary(courses),
    [courses]
  );

  const handleSearchKeywordChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setSearchKeyword(event.target.value);
      setCurrentPage(1);
    },
    []
  );

  const handleSearchSubmit = useCallback((event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(Math.max(1, page));
  }, []);

  return {
    courses,
    searchKeyword,
    currentPage,
    totalPages,
    totalElements,
    isLoading,
    error,
    summary,
    onSearchKeywordChange: handleSearchKeywordChange,
    onSearchSubmit: handleSearchSubmit,
    onPageChange: handlePageChange,
  };
};
