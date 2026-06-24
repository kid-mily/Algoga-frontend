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
  const [countryNameKeyword, setCountryNameKeyword] = useState("");
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
          countryName: countryNameKeyword.trim() || undefined,
        };

        const data = await getDeletedLectureListAction(params, signal);
        setCourses(Array.isArray(data.content) ? data.content : []);
        setTotalPages(Math.max(data.totalPages || 1, 1));
        setTotalElements(data.totalElements || 0);
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
    [countryNameKeyword, currentPage, selectedCountryId]
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

  const changeCountryNameKeyword = (value: string) => {
    setCountryNameKeyword(value);
    setCurrentPage(1);
  };

  return {
    courses,
    countries,
    currentPage,
    totalPages,
    totalElements,
    selectedCountryId,
    countryNameKeyword,
    isLoading,
    errorMessage,
    setCurrentPage,
    changeSelectedCountryId,
    changeCountryNameKeyword,
  };
}