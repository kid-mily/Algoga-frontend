"use client";

import { useMemo, useState } from "react";
import AdminErrorBanner from "@/features/common/AdminErrorBanner";
import SimpleSubHeader from "@/features/common/SimpleSubHeader";
import { downloadAdminPaymentsExcel } from "@/features/services/adminPayment.service";
import { AdminPayment, PaymentStatus, PaymentType } from "../types";
import { formatPaymentError, formatWon } from "../utils";
import { useAdminPaymentList } from "../hooks/useAdminPaymentList";
import PaymentPagination from "./PaymentPagination";
import PaymentTable from "./PaymentTable";
import PaymentToolbar from "./PaymentToolbar";

type PaymentManageClientProps = {
  initialPayments?: AdminPayment[];
};

const PAGE_SIZE = 10;

export default function PaymentManageClient({
  initialPayments = [],
}: PaymentManageClientProps) {
  const {
    filteredPayments,
    totalCount,
    filteredCount,
    successCount,
    totalAmount,
    searchKeyword,
    fromDate,
    toDate,
    selectedStatus,
    selectedType,
    isLoading,
    error,
    setSearchKeyword,
    setFromDate,
    setToDate,
    setSelectedStatus,
    setSelectedType,
    setError,
  } = useAdminPaymentList(initialPayments);
  const [currentPage, setCurrentPage] = useState(1);
  const [isDownloading, setIsDownloading] = useState(false);
  const totalPages = Math.max(1, Math.ceil(filteredPayments.length / PAGE_SIZE));
  const safeCurrentPage = Math.min(currentPage, totalPages);

  const pagedPayments = useMemo(() => {
    const start = (safeCurrentPage - 1) * PAGE_SIZE;

    return filteredPayments.slice(start, start + PAGE_SIZE);
  }, [filteredPayments, safeCurrentPage]);

  const handleSearchKeywordChange = (value: string) => {
    setSearchKeyword(value);
    setCurrentPage(1);
  };

  const handleFromDateChange = (value: string) => {
    setFromDate(value);
    if (toDate && value > toDate) {
      setToDate(value);
    }
    setCurrentPage(1);
  };

  const handleToDateChange = (value: string) => {
    setToDate(value);
    setCurrentPage(1);
  };

  const handleSelectedStatusChange = (value: PaymentStatus | "ALL") => {
    setSelectedStatus(value);
    setCurrentPage(1);
  };

  const handleSelectedTypeChange = (value: PaymentType | "ALL") => {
    setSelectedType(value);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(Math.min(Math.max(page, 1), totalPages));
  };

  const handleExcelDownload = async () => {
    if (isDownloading) return;

    try {
      setIsDownloading(true);
      setError("");
      await downloadAdminPaymentsExcel();
    } catch (downloadError: unknown) {
      setError(
        formatPaymentError(downloadError, "결제 내역 엑셀 다운로드에 실패했습니다.")
      );
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <main aria-labelledby="payment-management-title">
      <header className="mb-6 flex items-start justify-between gap-4">
        <div>
          <SimpleSubHeader
            title="결제 내역 조회"
            description={`총 ${totalCount}건 | 성공 ${successCount}건 | 조회 금액 ${formatWon(totalAmount)}`}
          />
          <span id="payment-management-title" className="sr-only">
            결제 내역 조회
          </span>
        </div>

        <button
          type="button"
          onClick={handleExcelDownload}
          disabled={isDownloading}
          className="mt-2 h-[42px] shrink-0 rounded-[10px] border border-[#E4E7EC] bg-white px-5 text-[14px] font-semibold text-[#344054] disabled:cursor-not-allowed disabled:text-[#98A2B3]"
        >
          {isDownloading ? "다운로드 중..." : "엑셀 다운로드"}
        </button>
      </header>

      <AdminErrorBanner message={error} className="mb-4" />

      <PaymentToolbar
        searchKeyword={searchKeyword}
        fromDate={fromDate}
        toDate={toDate}
        selectedStatus={selectedStatus}
        selectedType={selectedType}
        onSearchKeywordChange={handleSearchKeywordChange}
        onFromDateChange={handleFromDateChange}
        onToDateChange={handleToDateChange}
        onSelectedStatusChange={handleSelectedStatusChange}
        onSelectedTypeChange={handleSelectedTypeChange}
      />

      <PaymentTable payments={pagedPayments} isLoading={isLoading} />
      <PaymentPagination
        currentPage={safeCurrentPage}
        totalCount={filteredCount}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </main>
  );
}
