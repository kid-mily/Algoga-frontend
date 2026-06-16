"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { getCourseQnas } from "@/features/services/courseQna.service";
import { getAdminCourses } from "@/features/services/adminCourse.service";
import { AdminQnaItem, QnaStatusFilter } from "../types";

const ITEMS_PER_PAGE = 10;

const getErrorMessage = (error: unknown, fallback: string) => {
  return error instanceof Error ? error.message : fallback;
};

export const useAdminQnaList = () => {
  const [qnas, setQnas] = useState<AdminQnaItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [statusFilter, setStatusFilter] = useState<QnaStatusFilter>("all");
  const [currentPage, setCurrentPage] = useState(1);

  const fetchQnas = useCallback(async () => {
    try {
      setIsLoading(true);
      setError("");

      const courses = await getAdminCourses();
      const qnaGroups = await Promise.all(
        courses.map(async (course) => {
          const courseQnas = await getCourseQnas(course.courseId).catch(() => []);

          return courseQnas.map((qna) => ({
            ...qna,
            courseId: course.courseId,
            lecture: course.title,
          }));
        })
      );

      setQnas(qnaGroups.flat());
    } catch (fetchError: unknown) {
      setError(getErrorMessage(fetchError, "Q&A 목록을 불러오지 못했습니다."));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    queueMicrotask(() => {
      fetchQnas();
    });
  }, [fetchQnas]);

  const filteredQnas = useMemo(() => {
    const keyword = searchKeyword.trim().toLowerCase();

    return qnas.filter((qna) => {
      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "answered" && qna.isAnswered) ||
        (statusFilter === "waiting" && !qna.isAnswered);
      const matchesKeyword =
        !keyword ||
        qna.lecture.toLowerCase().includes(keyword) ||
        qna.title.toLowerCase().includes(keyword) ||
        qna.content.toLowerCase().includes(keyword) ||
        qna.writer.toLowerCase().includes(keyword);

      return matchesStatus && matchesKeyword;
    });
  }, [qnas, searchKeyword, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredQnas.length / ITEMS_PER_PAGE));
  const currentQnas = filteredQnas.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const changeStatusFilter = (value: QnaStatusFilter) => {
    setStatusFilter(value);
    setCurrentPage(1);
  };

  const changeSearchKeyword = (value: string) => {
    setSearchKeyword(value);
    setCurrentPage(1);
  };

  return {
    currentQnas,
    filteredCount: filteredQnas.length,
    isLoading,
    error,
    searchKeyword,
    statusFilter,
    currentPage,
    totalPages,
    setCurrentPage,
    setSearchKeyword: changeSearchKeyword,
    setStatusFilter: changeStatusFilter,
  };
};
