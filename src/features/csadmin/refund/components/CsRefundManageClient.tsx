"use client";

import { useMemo, useState } from "react";
import AdminErrorBanner from "@/features/common/AdminErrorBanner";
import CompleteModal from "@/features/common/CompleteModal";
import { downloadRefundExcel } from "@/features/services/adminRefund.service";
import { CsRefund, CsRefundStatus } from "../types";
import { useCsRefundList } from "../hooks/useCsRefundList";
import CsRefundPagination from "./CsRefundPagination";
import CsRefundTable from "./CsRefundTable";
import CsRefundToolbar from "./CsRefundToolbar";

type CsRefundManageClientProps = {
  initialRefunds: CsRefund[];
};

const PAGE_SIZE = 8;

export default function CsRefundManageClient({
  initialRefunds,
}: CsRefundManageClientProps) {
  const {
    searchKeyword,
    selectedStatus,
    filteredRefunds,
    totalCount,
    pendingCount,
    completeOpen,
    completeMessage,
    error,
    isLoading,
    processingId,
    setSearchKeyword,
    setSelectedStatus,
    setCompleteOpen,
    runRefundAction,
  } = useCsRefundList(initialRefunds);
  const [downloadError, setDownloadError] = useState("");
  const [isDownloading, setIsDownloading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(filteredRefunds.length / PAGE_SIZE));
  const safeCurrentPage = Math.min(currentPage, totalPages);

  const pagedRefunds = useMemo(() => {
    const start = (safeCurrentPage - 1) * PAGE_SIZE;

    return filteredRefunds.slice(start, start + PAGE_SIZE);
  }, [filteredRefunds, safeCurrentPage]);

  const handleSearchKeywordChange = (value: string) => {
    setSearchKeyword(value);
    setCurrentPage(1);
  };

  const handleSelectedStatusChange = (value: CsRefundStatus | "ALL") => {
    setSelectedStatus(value);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(Math.min(Math.max(page, 1), totalPages));
  };

  const handleExcelDownload = async () => {
    if (isDownloading) return;

    try {
      setIsDownloading(true);
      setDownloadError("");
      await downloadRefundExcel();
    } catch (downloadError: unknown) {
      setDownloadError(
        downloadError instanceof Error
          ? downloadError.message
          : "환불 내역 엑셀 다운로드에 실패했습니다."
      );
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <main aria-labelledby="refund-management-title">
      <header className="mb-6 flex items-start justify-between">
        <div>
          <h1 id="refund-management-title" className="text-[26px] font-bold text-[#111827]">
            환불 요청 관리
          </h1>
          <p className="mt-2 text-[14px] text-[#667085]">
            총 {totalCount}건 | 취소 요청{" "}
            <span className="font-bold text-[#EF4444]">{pendingCount}건</span>
          </p>
        </div>

        <button
          type="button"
          onClick={handleExcelDownload}
          disabled={isDownloading}
          className="flex h-[40px] items-center gap-2 rounded-[10px] border border-[#E4E7EC] bg-white px-4 text-[14px] font-semibold text-[#344054] disabled:cursor-not-allowed disabled:text-[#98A2B3]"
        >
          {isDownloading ? "내보내는 중..." : "내보내기"}
        </button>
      </header>

      <AdminErrorBanner message={error || downloadError} className="mb-4" />

      <CsRefundToolbar
        searchKeyword={searchKeyword}
        selectedStatus={selectedStatus}
        onSearchKeywordChange={handleSearchKeywordChange}
        onSelectedStatusChange={handleSelectedStatusChange}
      />

      <CsRefundTable
        refunds={pagedRefunds}
        isLoading={isLoading}
        processingId={processingId}
        onAction={runRefundAction}
      />
      <CsRefundPagination
        currentPage={safeCurrentPage}
        totalCount={filteredRefunds.length}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />

      <CompleteModal
        open={completeOpen}
        title="처리 완료"
        description={completeMessage}
        buttonText="확인"
        onConfirm={() => setCompleteOpen(false)}
      />
    </main>
  );
}
