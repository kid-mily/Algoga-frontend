"use client";

import { useMemo, useState } from "react";
import AdminErrorBanner from "@/features/common/AdminErrorBanner";
import CompleteModal from "@/features/common/CompleteModal";
import Modal from "@/features/common/Modal";
import SimpleSubHeader from "@/features/common/SimpleSubHeader";
import {
  approveRefund,
  completeRefund,
  rejectRefund,
} from "@/features/services/adminRefund.service";
import { useMoneyRefundList } from "../hooks/useMoneyRefundList";
import {
  MoneyRefund,
  MoneyRefundAction,
  moneyRefundActionLabel,
  MoneyRefundStatus,
} from "../types";
import { formatRefundError } from "../utils";
import MoneyRefundPagination from "./MoneyRefundPagination";
import MoneyRefundTable from "./MoneyRefundTable";
import MoneyRefundToolbar from "./MoneyRefundToolbar";

type MoneyRefundManageClientProps = {
  initialRefunds?: MoneyRefund[];
};

const PAGE_SIZE = 10;

export default function MoneyRefundManageClient({
  initialRefunds = [],
}: MoneyRefundManageClientProps) {
  const {
    filteredRefunds,
    totalCount,
    filteredCount,
    waitingCount,
    approvedCount,
    searchKeyword,
    selectedStatus,
    isLoading,
    error,
    setSearchKeyword,
    setSelectedStatus,
    setError,
    loadRefunds,
  } = useMoneyRefundList(initialRefunds);
  const [currentPage, setCurrentPage] = useState(1);
  const [processingId, setProcessingId] = useState<number | null>(null);
  const [confirmTarget, setConfirmTarget] = useState<{
    refund: MoneyRefund;
    action: MoneyRefundAction;
  } | null>(null);
  const [completeMessage, setCompleteMessage] = useState("");
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

  const handleSelectedStatusChange = (value: MoneyRefundStatus | "ALL") => {
    setSelectedStatus(value);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(Math.min(Math.max(page, 1), totalPages));
  };

  const handleConfirmAction = async () => {
    if (!confirmTarget || processingId) return;

    const { refund, action } = confirmTarget;
    const actionMap: Record<MoneyRefundAction, (refundId: number) => Promise<void>> = {
      approve: approveRefund,
      reject: rejectRefund,
      complete: completeRefund,
    };

    try {
      setProcessingId(refund.refundId);
      setError("");
      await actionMap[action](refund.refundId);
      await loadRefunds();
      setConfirmTarget(null);
      setCompleteMessage(`${moneyRefundActionLabel[action]} 처리가 완료되었습니다.`);
    } catch (actionError: unknown) {
      setError(formatRefundError(actionError, "환불 요청 처리에 실패했습니다."));
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <main aria-label="환불 승인 관리">
      <SimpleSubHeader
        title="환불 승인 관리"
        description={`총 ${totalCount}건 | 처리 대기 ${waitingCount}건 | 승인 후 완료 대기 ${approvedCount}건`}
      />

      <AdminErrorBanner message={error} className="mb-4" />

      <MoneyRefundToolbar
        searchKeyword={searchKeyword}
        selectedStatus={selectedStatus}
        onSearchKeywordChange={handleSearchKeywordChange}
        onSelectedStatusChange={handleSelectedStatusChange}
      />

      <MoneyRefundTable
        refunds={pagedRefunds}
        isLoading={isLoading}
        processingId={processingId}
        onAction={(refund, action) => setConfirmTarget({ refund, action })}
      />
      <MoneyRefundPagination
        currentPage={safeCurrentPage}
        totalCount={filteredCount}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />

      <Modal
        open={Boolean(confirmTarget)}
        title={confirmTarget ? moneyRefundActionLabel[confirmTarget.action] : "환불 처리"}
        description={
          confirmTarget
            ? `${confirmTarget.refund.id} 요청을 ${moneyRefundActionLabel[
                confirmTarget.action
              ]} 처리하시겠습니까?`
            : "환불 요청을 처리하시겠습니까?"
        }
        confirmText={processingId ? "처리 중..." : "확인"}
        cancelText="취소"
        confirmDisabled={Boolean(processingId)}
        onConfirm={handleConfirmAction}
        onCancel={() => setConfirmTarget(null)}
      />

      <CompleteModal
        open={Boolean(completeMessage)}
        title="처리 완료"
        description={completeMessage}
        buttonText="확인"
        onConfirm={() => setCompleteMessage("")}
      />
    </main>
  );
}
