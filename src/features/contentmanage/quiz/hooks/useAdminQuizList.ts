"use client";

import { useCallback, useEffect, useState } from "react";
import { getLectureListAction } from "@/features/contentmanage/lecture/actions";
import { AdminCourse } from "@/features/contentmanage/lecture/types";
import { getAdminQuizPage } from "@/features/services/adminQuiz.service";
import { AdminQuizWithLecture } from "../types";

const PAGE_SIZE = 10;

const getErrorMessage = (error: unknown, fallback: string) =>
  error instanceof Error ? error.message || fallback : fallback;

export function useAdminQuizList(initialCourseId = "all") {
  const [selectedLecture, setSelectedLectureState] = useState(initialCourseId || "all");
  const [searchKeyword, setSearchKeywordState] = useState("");
  const [courses, setCourses] = useState<AdminCourse[]>([]);
  const [quizzes, setQuizzes] = useState<AdminQuizWithLecture[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    void getLectureListAction()
      .then((data) => setCourses(Array.isArray(data) ? data : []))
      .catch(() => setCourses([]));
  }, []);

  const fetchQuizzes = useCallback(async () => {
    try {
      setIsLoading(true);
      setErrorMessage("");
      const data = await getAdminQuizPage({
        page: currentPage - 1,
        size: PAGE_SIZE,
        courseId:
          selectedLecture === "all" ? undefined : Number(selectedLecture),
        keyword: searchKeyword.trim() || undefined,
      });

      setQuizzes(data.content);
      setTotalPages(Math.max(data.totalPages, 1));
      setTotalElements(data.totalElements);
    } catch (error: unknown) {
      setErrorMessage(getErrorMessage(error, "퀴즈 목록을 불러오지 못했습니다."));
      setQuizzes([]);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, searchKeyword, selectedLecture]);

  useEffect(() => {
    const timer = window.setTimeout(() => void fetchQuizzes(), 250);
    return () => window.clearTimeout(timer);
  }, [fetchQuizzes]);

  const setSelectedLecture = (value: string) => {
    setSelectedLectureState(value);
    setCurrentPage(1);
  };

  const setSearchKeyword = (value: string) => {
    setSearchKeywordState(value);
    setCurrentPage(1);
  };

  return {
    selectedLecture,
    setSelectedLecture,
    searchKeyword,
    setSearchKeyword,
    courses,
    filteredQuizzes: quizzes,
    currentPage,
    totalPages,
    totalElements,
    setCurrentPage,
    isLoading,
    errorMessage,
    refetch: fetchQuizzes,
  };
}
