"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import AdminErrorBanner from "@/features/common/AdminErrorBanner";
import SimpleSubHeader from "@/features/common/SimpleSubHeader";
import { getAdminReports } from "@/features/services/adminReport.service";
import { AdminReportPage, ReportStatus, ReportTargetType } from "../types";
import { formatReportError } from "../utils";
import ReportPagination from "./ReportPagination";
import ReportTable from "./ReportTable";

const emptyPage: AdminReportPage = {
  reports: [],
  page: 0,
  size: 10,
  totalElements: 0,
  totalPages: 0,
  first: true,
  last: true,
};

type ReportManageClientProps = {
  initialPage: number;
};

export default function ReportManageClient({
  initialPage,
}: ReportManageClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [reportPage, setReportPage] = useState<AdminReportPage>(emptyPage);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const abortControllerRef = useRef<AbortController | null>(null);
  const pageParam = searchParams.get("page");
  const statusParam = searchParams.get("status");
  const targetTypeParam = searchParams.get("targetType");
  const keywordParam = searchParams.get("keyword") ?? "";
  const parsedPage = Number(pageParam);
  const parsedInitialPage = Number(initialPage);
  const fallbackPage =
    Number.isFinite(parsedInitialPage) && parsedInitialPage >= 1
      ? Math.floor(parsedInitialPage)
      : 1;

  const currentPage =
    Number.isFinite(parsedPage) && parsedPage >= 1
      ? Math.floor(parsedPage)
      : fallbackPage;
  const selectedStatus: ReportStatus | "ALL" =
    statusParam === "RECEIVED" ||
    statusParam === "REJECTED" ||
    statusParam === "COMPLETED"
      ? statusParam
      : "ALL";
  const selectedTargetType: ReportTargetType | "ALL" =
    targetTypeParam === "POST" || targetTypeParam === "COMMENT"
      ? targetTypeParam
      : "ALL";

  useEffect(() => {
    abortControllerRef.current?.abort();
    const controller = new AbortController();
    abortControllerRef.current = controller;

    const fetchReports = async () => {
      try {
        setIsLoading(true);
        setError("");
        const data = await getAdminReports({
          page: currentPage - 1,
          size: 10,
          status: selectedStatus,
          targetType: selectedTargetType,
          keyword: keywordParam,
          signal: controller.signal,
        });
        if (controller.signal.aborted) return;
        setReportPage(data);
      } catch (fetchError: unknown) {
        if (controller.signal.aborted) return;
        setError(formatReportError(fetchError, "신고 내역을 불러오지 못했습니다."));
        setReportPage(emptyPage);
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    void fetchReports();

    return () => {
      controller.abort();
    };
  }, [currentPage, keywordParam, selectedStatus, selectedTargetType]);

  const updateSearchParams = (updates: Record<string, string>) => {
    const nextParams = new URLSearchParams(searchParams.toString());

    Object.entries(updates).forEach(([key, value]) => {
      if (value) {
        nextParams.set(key, value);
      } else {
        nextParams.delete(key);
      }
    });

    nextParams.set("page", updates.page ?? "1");
    router.push(`/csadmin/reports?${nextParams.toString()}`);
  };

  const handlePageChange = (page: number) => {
    updateSearchParams({ page: String(page) });
  };

  const handleStatusChange = (value: string) => {
    updateSearchParams({ status: value === "ALL" ? "" : value, page: "1" });
  };

  const handleTargetTypeChange = (value: string) => {
    updateSearchParams({
      targetType: value === "ALL" ? "" : value,
      page: "1",
    });
  };

  const handleSearchSubmit = (keyword: string) => {
    updateSearchParams({ keyword: keyword.trim(), page: "1" });
  };

  const pendingCount = reportPage.reports.filter(
    (report) => report.status === "RECEIVED"
  ).length;

  return (
    <main aria-labelledby="report-management-title">
      <SimpleSubHeader
        title="신고 내역 관리"
        description={`총 ${reportPage.totalElements}건 | 현재 페이지 처리 대기 ${pendingCount}건`}
      />
      <span id="report-management-title" className="sr-only">
        신고 내역 관리
      </span>

      <AdminErrorBanner message={error} className="mb-4" />

      <ReportFilters
        key={keywordParam}
        keyword={keywordParam}
        selectedStatus={selectedStatus}
        selectedTargetType={selectedTargetType}
        onSearchSubmit={handleSearchSubmit}
        onStatusChange={handleStatusChange}
        onTargetTypeChange={handleTargetTypeChange}
      />

      <ReportTable reports={reportPage.reports} isLoading={isLoading} />
      <ReportPagination
        currentPage={currentPage}
        totalCount={reportPage.totalElements}
        totalPages={Math.max(reportPage.totalPages, 1)}
        onPageChange={handlePageChange}
      />
    </main>
  );
}

function ReportFilters({
  keyword,
  selectedStatus,
  selectedTargetType,
  onSearchSubmit,
  onStatusChange,
  onTargetTypeChange,
}: {
  keyword: string;
  selectedStatus: ReportStatus | "ALL";
  selectedTargetType: ReportTargetType | "ALL";
  onSearchSubmit: (keyword: string) => void;
  onStatusChange: (value: string) => void;
  onTargetTypeChange: (value: string) => void;
}) {
  const [keywordInput, setKeywordInput] = useState(keyword);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSearchSubmit(keywordInput);
  };

  return (
    <section className="mb-5 rounded-[16px] border border-[#E4E7EC] bg-white p-4">
      <form
        role="search"
        aria-label="신고 내역 검색"
        className="flex flex-wrap items-center gap-3"
        onSubmit={handleSubmit}
      >
        <label className="flex h-[42px] min-w-[280px] flex-1 items-center rounded-[10px] border border-[#E4E7EC] px-4">
          <span className="sr-only">신고자 또는 피신고자 검색</span>
          <input
            type="search"
            value={keywordInput}
            onChange={(event) => setKeywordInput(event.target.value)}
            placeholder="신고자/피신고자 이름, 닉네임 검색"
            className="w-full text-[14px] outline-none placeholder:text-[#98A2B3]"
          />
        </label>

        <select
          value={selectedStatus}
          onChange={(event) => onStatusChange(event.target.value)}
          aria-label="신고 처리 상태 필터"
          className="h-[42px] rounded-[10px] border border-[#E4E7EC] bg-white px-3 text-[14px] font-semibold text-[#344054]"
        >
          <option value="ALL">전체 상태</option>
          <option value="RECEIVED">접수</option>
          <option value="REJECTED">반려</option>
          <option value="COMPLETED">처리 완료</option>
        </select>

        <select
          value={selectedTargetType}
          onChange={(event) => onTargetTypeChange(event.target.value)}
          aria-label="신고 유형 필터"
          className="h-[42px] rounded-[10px] border border-[#E4E7EC] bg-white px-3 text-[14px] font-semibold text-[#344054]"
        >
          <option value="ALL">전체 유형</option>
          <option value="POST">게시글</option>
          <option value="COMMENT">댓글</option>
        </select>

        <button
          type="submit"
          className="h-[42px] rounded-[10px] bg-[#439A97] px-5 text-[14px] font-semibold text-white"
        >
          검색
        </button>
      </form>
    </section>
  );
}
