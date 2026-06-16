"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent } from "react";
import AdminErrorBanner from "@/features/common/AdminErrorBanner";
import CompleteModal from "@/features/common/CompleteModal";
import Modal from "@/features/common/Modal";
import { refundStatusOptions, CsRefundFormData } from "../types";
import { useRefundForm } from "../hooks/useRefundForm";
import RefundStatusBadge from "./RefundStatusBadge";
import { RefundCancelSection, RefundReservationSection } from "./RefundInfoSections";
import RefundSidePanel from "./RefundSidePanel";

type RefundFormClientProps = {
  mode: "create" | "edit";
  refundId: number;
};

export default function RefundFormClient({ mode, refundId }: RefundFormClientProps) {
  const router = useRouter();
  const {
    refund,
    formData,
    error,
    isLoading,
    isSubmitting,
    confirmOpen,
    completeOpen,
    setConfirmOpen,
    setCompleteOpen,
    updateField,
    saveRefund,
  } = useRefundForm(refundId, mode);

  const title = mode === "create" ? "환불 검토 요청" : "환불 요청 처리";
  const completeDescription =
    mode === "create"
      ? "환불 검토 요청이 완료되었습니다."
      : "환불 요청 처리가 완료되었습니다.";
  const statusOptions = refundStatusOptions.filter(
    (status) => status !== "ALL" && status !== "취소 요청" && status !== "정산 검토중"
  );

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (mode === "edit") {
      setConfirmOpen(true);
      return;
    }

    void saveRefund().catch((saveError: unknown) => {
      console.error("saveRefund failed:", saveError);
    });
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
          <Link
            href="/csadmin/refund"
            className="mb-3 inline-flex text-[14px] font-semibold text-[#344054]"
          >
            환불 요청 목록으로 돌아가기
          </Link>
          <h1 id="refund-form-title" className="text-[26px] font-bold text-[#111827]">
            {title}
          </h1>
          <p className="mt-2 text-[14px] text-[#667085]">요청번호: {refund.id}</p>
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
                {mode === "create"
                  ? "환불 요청을 검토 상태로 전달합니다."
                  : "환불 요청의 처리 상태를 변경합니다."}
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
                <div className="flex h-[44px] items-center rounded-[10px] border border-[#E4E7EC] bg-[#F9FAFB] px-4">
                  <input
                    id="refund-amount"
                    value={Number(formData.refundAmount || 0).toLocaleString()}
                    readOnly
                    className="flex-1 bg-transparent text-[14px] outline-none"
                  />
                  <span className="text-[14px] text-[#344054]">원</span>
                </div>
                <p className="mt-2 text-[12px] text-[#667085]">
                  결제 금액: {refund.paymentAmount.toLocaleString()}원
                </p>
              </div>

              {mode === "edit" && (
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
                    {statusOptions.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <footer className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => router.push("/csadmin/refund")}
                  className="h-[42px] rounded-[10px] border border-[#E4E7EC] bg-white px-5 text-[14px] font-semibold text-[#344054]"
                >
                  취소
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex h-[42px] items-center gap-2 rounded-[10px] bg-[#639E9B] px-5 text-[14px] font-semibold text-white disabled:cursor-not-allowed disabled:bg-[#D0D5DD]"
                >
                  {isSubmitting
                    ? "처리 중..."
                    : mode === "create"
                      ? "검토 요청"
                      : "처리 완료"}
                </button>
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
        description={completeDescription}
        buttonText="확인"
        onConfirm={() => {
          setCompleteOpen(false);
          router.push("/csadmin/refund");
        }}
      />
    </main>
  );
}
