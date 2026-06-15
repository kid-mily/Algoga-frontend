import { useCallback, useEffect, useMemo, useState } from "react";
import { getAdminInquiries } from "@/features/services/adminInquiry.service";
import {
  CsInquiry,
  CsInquiryCategoryFilter,
  CsInquiryStatusFilter,
} from "../types";

export const useCsInquiryList = (initialInquiries: CsInquiry[]) => {
  const [inquiries, setInquiries] = useState<CsInquiry[]>(initialInquiries);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedCategory, setSelectedCategory] =
    useState<CsInquiryCategoryFilter>("ALL");
  const [selectedStatus, setSelectedStatus] =
    useState<CsInquiryStatusFilter>("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(initialInquiries.length);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchInquiries = useCallback(
    async (signal?: AbortSignal) => {
      try {
        setIsLoading(true);
        setError("");

        const data = await getAdminInquiries({
          category: selectedCategory,
          status: selectedStatus,
          page: currentPage - 1,
          signal,
        });

        if (signal?.aborted) return;

        setInquiries(data.inquiries);
        setTotalCount(data.totalElements);
        setTotalPages(Math.max(1, data.totalPages));
      } catch (fetchError: unknown) {
        if (signal?.aborted) return;

        setInquiries([]);
        setTotalCount(0);
        setTotalPages(1);
        setError(
          fetchError instanceof Error
            ? fetchError.message
            : "고객 문의 목록을 불러오지 못했습니다."
        );
      } finally {
        if (!signal?.aborted) {
          setIsLoading(false);
        }
      }
    },
    [currentPage, selectedCategory, selectedStatus]
  );

  useEffect(() => {
    const controller = new AbortController();

    void Promise.resolve().then(() => {
      if (!controller.signal.aborted) {
        void fetchInquiries(controller.signal);
      }
    });

    return () => controller.abort();
  }, [fetchInquiries]);

  const filteredInquiries = useMemo(() => {
    const keyword = searchKeyword.trim().toLowerCase();

    if (!keyword) return inquiries;

    return inquiries.filter((inquiry) => {
      return (
        inquiry.title.toLowerCase().includes(keyword) ||
        inquiry.writer.toLowerCase().includes(keyword) ||
        inquiry.id.toLowerCase().includes(keyword)
      );
    });
  }, [inquiries, searchKeyword]);

  const pendingCount = useMemo(
    () => inquiries.filter((inquiry) => inquiry.statusCode === "PENDING").length,
    [inquiries]
  );

  const changeSearchKeyword = (value: string) => {
    setSearchKeyword(value);
  };

  const changeSelectedCategory = (value: CsInquiryCategoryFilter) => {
    setSelectedCategory(value);
    setCurrentPage(1);
  };

  const changeSelectedStatus = (value: CsInquiryStatusFilter) => {
    setSelectedStatus(value);
    setCurrentPage(1);
  };

  return {
    searchKeyword,
    selectedCategory,
    selectedStatus,
    filteredInquiries,
    totalCount,
    pendingCount,
    currentPage,
    totalPages,
    isLoading,
    error,
    setSearchKeyword: changeSearchKeyword,
    setSelectedCategory: changeSelectedCategory,
    setSelectedStatus: changeSelectedStatus,
    setCurrentPage,
    refetch: fetchInquiries,
  };
};



