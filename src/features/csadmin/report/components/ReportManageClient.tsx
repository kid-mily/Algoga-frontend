"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import AdminErrorBanner from "@/features/common/AdminErrorBanner";
import SimpleSubHeader from "@/features/common/SimpleSubHeader";
import { getAdminReports } from "@/features/services/adminReport.service";
import { AdminReportPage } from "../types";
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

  const currentPage = Math.max(
    1,
    Number(searchParams.get("page") || initialPage || 1)
  );

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
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    const nextParams = new URLSearchParams(searchParams.toString());
    nextParams.set("page", String(page));
    router.push(`/csadmin/reports?${nextParams.toString()}`);
  };

  const pendingCount = reportPage.reports.filter(
    (report) => report.status === "PENDING"
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
