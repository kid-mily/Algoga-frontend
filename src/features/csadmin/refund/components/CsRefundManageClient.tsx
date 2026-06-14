"use client";

import { useState } from "react";
import CompleteModal from "@/features/common/CompleteModal";
import { downloadRefundExcel } from "@/features/services/adminRefund.service";
import { CsRefund } from "../types";
import { useCsRefundList } from "../hooks/useCsRefundList";
import CsRefundPagination from "./CsRefundPagination";
import CsRefundTable from "./CsRefundTable";
import CsRefundToolbar from "./CsRefundToolbar";

type CsRefundManageClientProps = {
  initialRefunds: CsRefund[];
};

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

  const handleExcelDownload = async () => {
    try {
      setDownloadError("");
      await downloadRefundExcel();
    } catch (downloadError: unknown) {
      setDownloadError(
        downloadError instanceof Error
          ? downloadError.message
          : "환불 내역 엑셀 다운로드에 실패했습니다."
      );
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
          className="flex h-[40px] items-center gap-2 rounded-[10px] border border-[#E4E7EC] bg-white px-4 text-[14px] font-semibold text-[#344054]"
        >
          내보내기
        </button>
      </header>

      {(error || downloadError) && (
        <section
          role="alert"
          className="mb-4 rounded-[12px] bg-[#FEF2F2] p-4 text-[14px] text-[#DC2626]"
        >
          {error || downloadError}
        </section>
      )}

      <CsRefundToolbar
        searchKeyword={searchKeyword}
        selectedStatus={selectedStatus}
        onSearchKeywordChange={setSearchKeyword}
        onSelectedStatusChange={setSelectedStatus}
      />

      <CsRefundTable
        refunds={filteredRefunds}
        isLoading={isLoading}
        processingId={processingId}
        onAction={runRefundAction}
      />
      <CsRefundPagination totalCount={filteredRefunds.length} />

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
