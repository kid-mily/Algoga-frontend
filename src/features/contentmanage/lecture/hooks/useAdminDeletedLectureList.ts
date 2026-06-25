"use client";

import { useCallback, useEffect, useState } from "react";
import {
  getDeletedLectureListAction,
  getLectureCountriesAction,
} from "../actions";
import {
  AdminDeletedCourse,
  CourseCountry,
  DeletedCourseQueryParams,
} from "../types";

const DEFAULT_PAGE_SIZE = 10;

export function useAdminDeletedLectureList() {
  const [courses, setCourses] = useState<AdminDeletedCourse[]>([]);
  const [countries, setCountries] = useState<CourseCountry[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [selectedCountryId, setSelectedCountryId] = useState("");
  const [lectureTitleKeyword, setLectureTitleKeyword] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const fetchDeletedCourses = useCallback(
    async (signal?: AbortSignal) => {
      try {
        setIsLoading(true);
        setErrorMessage("");

        const params: DeletedCourseQueryParams = {
          page: Math.max(currentPage - 1, 0),
          size: DEFAULT_PAGE_SIZE,
          countryId: selectedCountryId ? Number(selectedCountryId) : undefined,
        };

        const data = await getDeletedLectureListAction(params, signal);
        const countryNameMap = new Map(
          countries.map((country) => [country.countryId, country.countryName])
        );
        const coursesWithCountryNames = Array.isArray(data.content)
          ? data.content.map((course) => ({
              ...course,
              countryName:
                course.countryName || countryNameMap.get(course.countryId) || "-",
            }))
          : [];
        const keyword = lectureTitleKeyword.trim().toLowerCase();
        const filteredCourses = keyword
          ? coursesWithCountryNames.filter((course) =>
              course.title.toLowerCase().includes(keyword)
            )
          : coursesWithCountryNames;

        setCourses(filteredCourses);
        setTotalPages(keyword ? 1 : Math.max(data.totalPages || 1, 1));
        setTotalElements(keyword ? filteredCourses.length : data.totalElements || 0);
      } catch (error: unknown) {
        if (signal?.aborted) return;

        setCourses([]);
        setTotalPages(1);
        setTotalElements(0);
        setErrorMessage(
          error instanceof Error
            ? error.message
            : "삭제 강의 목록을 불러오지 못했습니다."
        );
      } finally {
        if (!signal?.aborted) {
          setIsLoading(false);
        }
      }
    },
    [countries, currentPage, lectureTitleKeyword, selectedCountryId]
  );

  useEffect(() => {
    const controller = new AbortController();

    // eslint-disable-next-line react-hooks/set-state-in-effect
    void fetchDeletedCourses(controller.signal);

    return () => controller.abort();
  }, [fetchDeletedCourses]);

  useEffect(() => {
    const controller = new AbortController();

    const fetchCountries = async () => {
      try {
        const data = await getLectureCountriesAction(controller.signal);
        setCountries(data);
      } catch {
        setCountries([]);
      }
    };

    void fetchCountries();

    return () => controller.abort();
  }, []);

  const changeSelectedCountryId = (value: string) => {
    setSelectedCountryId(value);
    setCurrentPage(1);
  };

  const changeLectureTitleKeyword = (value: string) => {
    setLectureTitleKeyword(value);
    setCurrentPage(1);
  };

  return {
    courses,
    countries,
    currentPage,
    totalPages,
    totalElements,
    selectedCountryId,
    lectureTitleKeyword,
    isLoading,
    errorMessage,
    setCurrentPage,
    changeSelectedCountryId,
    changeLectureTitleKeyword,
  };
}
