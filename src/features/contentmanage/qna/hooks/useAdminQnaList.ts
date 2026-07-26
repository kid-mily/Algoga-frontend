"use client";

import { useCallback, useEffect, useState } from "react";
import { getAdminCourseQnaPage } from "@/features/services/courseQna.service";
import { AdminQnaItem, QnaStatusFilter } from "../types";

const ITEMS_PER_PAGE = 10;

export const useAdminQnaList = () => {
  const [qnas, setQnas] = useState<AdminQnaItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchKeyword, setSearchKeywordState] = useState("");
  const [statusFilter, setStatusFilterState] = useState<QnaStatusFilter>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);

  const fetchQnas = useCallback(async () => {
    try {
      setIsLoading(true);
      setError("");
      const data = await getAdminCourseQnaPage({
        page: currentPage - 1,
        size: ITEMS_PER_PAGE,
        keyword: searchKeyword.trim() || undefined,
        answered:
          statusFilter === "all" ? undefined : statusFilter === "answered",
      });
      setQnas(data.content);
      setTotalPages(Math.max(data.totalPages, 1));
      setTotalElements(data.totalElements);
    } catch (fetchError: unknown) {
      setError(
        fetchError instanceof Error
          ? fetchError.message
          : "Q&A 목록을 불러오지 못했습니다."
      );
      setQnas([]);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, searchKeyword, statusFilter]);

  useEffect(() => {
    const timer = window.setTimeout(() => void fetchQnas(), 250);
    return () => window.clearTimeout(timer);
  }, [fetchQnas]);

  const setStatusFilter = (value: QnaStatusFilter) => {
    setStatusFilterState(value);
    setCurrentPage(1);
  };

  const setSearchKeyword = (value: string) => {
    setSearchKeywordState(value);
    setCurrentPage(1);
  };

  return {
    currentQnas: qnas,
    filteredCount: totalElements,
    isLoading,
    error,
    searchKeyword,
    statusFilter,
    currentPage,
    totalPages,
    setCurrentPage,
    setSearchKeyword,
    setStatusFilter,
  };
};
