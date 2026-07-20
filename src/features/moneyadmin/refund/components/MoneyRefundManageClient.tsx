"use client";

import { useCallback, useMemo, useState } from "react";
import AdminErrorBanner from "@/features/common/components/AdminErrorBanner";
import CompleteModal from "@/features/common/components/CompleteModal";
import Modal from "@/features/common/components/Modal";
import SimpleSubHeader from "@/features/common/components/SimpleSubHeader";
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
  hasInitialData?: boolean;
};

const PAGE_SIZE = 10;

export default function MoneyRefundManageClient({
  initialRefunds = [],
  hasInitialData = false,
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
  } = useMoneyRefundList(initialRefunds, hasInitialData);
  const [currentPage, setCurrentPage] = useState(1);
  const [processingId, setProcessingId] = useState<number | null>(null);
  const [confirmTarget, setConfirmTarget] = useState<{
    refund: MoneyRefund;
    action: MoneyRefundAction;
  } | null>(null);
  const [completeMessage, setCompleteMessage] = useState("");
  const [rejectReason, setRejectReason] = useState("");
  const totalPages = Math.max(1, Math.ceil(filteredRefunds.length / PAGE_SIZE));
  const safeCurrentPage = Math.min(currentPage, totalPages);

  const pagedRefunds = useMemo(() => {
    const start = (safeCurrentPage - 1) * PAGE_SIZE;

    return filteredRefunds.slice(start, start + PAGE_SIZE);
  }, [filteredRefunds, safeCurrentPage]);

  const handleSearchKeywordChange = useCallback((value: string) => {
    setSearchKeyword(value);
    setCurrentPage(1);
  }, [setSearchKeyword]);

  const handleSelectedStatusChange = useCallback((value: MoneyRefundStatus | "ALL") => {
    setSelectedStatus(value);
    setCurrentPage(1);
  }, [setSelectedStatus]);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(Math.min(Math.max(page, 1), totalPages));
  }, [totalPages]);

  const handleAction = useCallback((refund: MoneyRefund, action: MoneyRefundAction) => {
    if (confirmTarget) return;

    setRejectReason("");
    setConfirmTarget({ refund, action });
  }, [confirmTarget]);

  const handleCancelAction = useCallback(() => {
    setConfirmTarget(null);
    setRejectReason("");
  }, []);

  const handleConfirmAction = async () => {
    if (!confirmTarget || processingId) return;

    const { refund, action } = confirmTarget;
    const trimmedReason = rejectReason.trim();

    if (action === "reject" && !trimmedReason) return;

    try {
      setProcessingId(refund.refundId);
      setError("");

      if (action === "approve") {
        await approveRefund(refund.refundId);
      } else if (action === "reject") {
        await rejectRefund(refund.refundId, trimmedReason);
      } else {
        await completeRefund(refund.refundId);
      }

      await loadRefunds();
      setConfirmTarget(null);
      setRejectReason("");
      setCompleteMessage(`${moneyRefundActionLabel[action]} 처리가 완료되었습니다.`);
    } catch (actionError: unknown) {
      // 에러 시에도 확인 모달을 닫아 상단 에러 배너(원인 메시지)가 보이도록 합니다.
      setConfirmTarget(null);
      setRejectReason("");
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
        actionsDisabled={Boolean(confirmTarget)}
        onAction={handleAction}
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
        confirmDisabled={
          Boolean(processingId) ||
          (confirmTarget?.action === "reject" && !rejectReason.trim())
        }
        onConfirm={handleConfirmAction}
        onCancel={handleCancelAction}
      >
        {confirmTarget?.action === "reject" && (
          <div className="text-left">
            <label
              htmlFor="money-reject-reason"
              className="mb-2 block text-[14px] font-semibold text-[#344054]"
            >
              반려 사유
            </label>
            <textarea
              id="money-reject-reason"
              value={rejectReason}
              onChange={(event) => setRejectReason(event.target.value)}
              placeholder="반려 사유를 입력해주세요."
              className="h-[100px] w-full resize-none rounded-[10px] border border-[#E4E7EC] px-4 py-3 text-[14px] outline-none focus:border-[#639E9B]"
            />
          </div>
        )}
      </Modal>

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
