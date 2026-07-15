"use client";

import { useRouter } from "next/navigation";
import { FormEvent } from "react";
import AdminErrorBanner from "@/features/common/components/AdminErrorBanner";
import CompleteModal from "@/features/common/components/CompleteModal";
import Modal from "@/features/common/components/Modal";
import { CsRefundFormData } from "../types";
import { useRefundForm } from "../hooks/useRefundForm";
import RefundStatusBadge from "./RefundStatusBadge";
import { RefundCancelSection, RefundReservationSection } from "./RefundInfoSections";
import RefundSidePanel from "./RefundSidePanel";
import SubHeader from "@/features/common/components/SubHeader";

type RefundFormClientProps = {
  refundId: number;
};

export default function RefundFormClient({ refundId }: RefundFormClientProps) {
  const router = useRouter();
  const {
    refund,
    formData,
    nextStatusOptions,
    error,
    isLoading,
    isSubmitting,
    confirmOpen,
    completeOpen,
    setConfirmOpen,
    setCompleteOpen,
    updateField,
    saveRefund,
  } = useRefundForm(refundId);

  const hasNextAction = nextStatusOptions.length > 0;
  const isInitialRequest = refund?.statusCode?.trim().toUpperCase() === "REQUESTED";
  const title = isInitialRequest ? "환불 검토 요청" : "환불 요청 처리";
  const isRejectSelected = formData.status === "반려";

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setConfirmOpen(true);
  };

  if (isLoading) {
    return (
      <section className="rounded-[16px] border border-[#E4E7EC] bg-white p-8 text-center text-[14px] text-[#667085]">
        환불 요청 정보를 불러오는 중입니다...
      </section>
    );
  }

  if (!refund) {
    return (
      <AdminErrorBanner
        message={error || "환불 요청 정보를 찾을 수 없습니다."}
        className="m-0"
      />
    );
  }

  return (
    <main aria-labelledby="refund-form-title">
      <header className="mb-6 flex items-start justify-between">
        <div>
          <SubHeader
            backHref="/csadmin/refund"
            backText="환불 요청 목록으로 돌아가기"
            title={title}
            description={`요청번호: ${refund.id}`}
          />
        </div>

        <div className="flex items-center gap-3">
          <RefundStatusBadge status={refund.status} />
          <span className="text-[13px] text-[#667085]">{refund.requestedAt}</span>
        </div>
      </header>

      <AdminErrorBanner message={error} className="mb-4" />

      <div className="grid grid-cols-[minmax(0,1fr)_380px] gap-6 xl:grid-cols-[minmax(0,1fr)_420px]">
        <div className="space-y-6">
          <RefundReservationSection refund={refund} />
          <RefundCancelSection refund={refund} />

          <section className="overflow-hidden rounded-[16px] border border-[#E4E7EC] bg-white">
            <header className="bg-gradient-to-r from-[#DDF5DE] to-[#F3FBFB] px-6 py-5">
              <h2 className="text-[18px] font-bold text-[#111827]">{title}</h2>
              <p className="mt-2 text-[13px] text-[#667085]">
                {hasNextAction
                  ? "환불 요청의 처리 상태를 변경합니다."
                  : "이미 처리가 종료되어 추가로 변경할 수 있는 상태가 없습니다."}
              </p>
            </header>

            <form onSubmit={handleSubmit} className="space-y-5 px-6 py-6">
              <div>
                <label
                  htmlFor="refund-reason"
                  className="mb-3 block text-[14px] font-semibold text-[#344054]"
                >
                  환불 사유
                </label>
                <textarea
                  id="refund-reason"
                  value={formData.reason}
                  readOnly
                  className="h-[120px] w-full resize-none rounded-[10px] border border-[#E4E7EC] bg-[#F9FAFB] px-4 py-3 text-[14px] outline-none"
                />
              </div>

              <div>
                <label
                  htmlFor="refund-amount"
                  className="mb-3 block text-[14px] font-semibold text-[#344054]"
                >
                  환불 예정 금액
                </label>
                <div
                  id="refund-amount"
                  className="flex h-[44px] items-center rounded-[10px] border border-[#E4E7EC] bg-[#F9FAFB] px-4 text-[14px]"
                >
                  <span className="flex-1 text-[#111827]">
                    {Number(formData.refundAmount || 0).toLocaleString()}
                  </span>
                  <span className="text-[14px] text-[#344054]">원</span>
                </div>
                <p className="mt-2 text-[12px] text-[#667085]">
                  결제 금액: {refund.paymentAmount.toLocaleString()}원
                </p>
              </div>

              {hasNextAction && (
                <div>
                  <label
                    htmlFor="refund-status"
                    className="mb-3 block text-[14px] font-semibold text-[#344054]"
                  >
                    처리 상태
                  </label>
                  <select
                    id="refund-status"
                    value={formData.status}
                    onChange={(event) =>
                      updateField("status", event.target.value as CsRefundFormData["status"])
                    }
                    className="h-[44px] w-full rounded-[10px] border border-[#E4E7EC] px-4 text-[14px] outline-none focus:border-[#639E9B]"
                  >
                    <option value="" disabled>
                      선택하세요
                    </option>
                    {nextStatusOptions.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {hasNextAction && isRejectSelected && (
                <div>
                  <label
                    htmlFor="refund-reject-reason"
                    className="mb-3 block text-[14px] font-semibold text-[#344054]"
                  >
                    반려 사유
                  </label>
                  <textarea
                    id="refund-reject-reason"
                    value={formData.rejectReason}
                    onChange={(event) => updateField("rejectReason", event.target.value)}
                    placeholder="반려 사유를 입력해주세요."
                    className="h-[100px] w-full resize-none rounded-[10px] border border-[#E4E7EC] px-4 py-3 text-[14px] outline-none focus:border-[#639E9B]"
                  />
                </div>
              )}

              <footer className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => router.push("/csadmin/refund")}
                  className="h-[42px] rounded-[10px] border border-[#E4E7EC] bg-white px-5 text-[14px] font-semibold text-[#344054]"
                >
                  {hasNextAction ? "취소" : "목록으로"}
                </button>

                {hasNextAction && (
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex h-[42px] items-center gap-2 rounded-[10px] bg-[#639E9B] px-5 text-[14px] font-semibold text-white disabled:cursor-not-allowed disabled:bg-[#D0D5DD]"
                  >
                    {isSubmitting
                      ? "처리 중..."
                      : formData.status === "정산 검토중"
                        ? "검토 요청"
                        : formData.status === "반려"
                          ? "반려 처리"
                          : "처리"}
                  </button>
                )}
              </footer>
            </form>
          </section>
        </div>

        <RefundSidePanel refund={refund} />
      </div>

      <Modal
        open={confirmOpen}
        title="환불 요청 처리"
        description="환불 요청 상태를 변경하시겠습니까?"
        confirmText="처리"
        cancelText="취소"
        onConfirm={() => {
          setConfirmOpen(false);
          void saveRefund().catch((saveError: unknown) => {
            console.error("saveRefund failed:", saveError);
          });
        }}
        onCancel={() => setConfirmOpen(false)}
      />

      <CompleteModal
        open={completeOpen}
        title="처리 완료"
        description="환불 요청 처리가 완료되었습니다."
        buttonText="확인"
        onConfirm={() => {
          setCompleteOpen(false);
          router.push("/csadmin/refund");
        }}
      />
    </main>
  );
}
