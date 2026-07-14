"use client";

import { useState } from "react";
import {
  REFUND_REASON_MAX_LENGTH,
  getRefundRate,
  getRefundReasonError,
} from "./reservation.data";
import { PAYMENT_TYPE_LABEL, type ReservationItem } from "./reservation.types";

interface RefundRequestModalProps {
  reservation: ReservationItem;
  onCancel: () => void;
  onConfirm: (reason: string) => void;
}

// 환불 요청 확인 안내 문구 (공통 Modal은 폼을 담기 어려워 이 화면 전용으로 직접 구현)
const GUIDE_LINES = [
  "환불 요청 후 관리자의 확인 절차가 진행됩니다.",
  "환불 규정과 이용 예정일에 따라 실제 환불 금액이 달라질 수 있습니다.",
  "관리자 검토 결과 환불 요청이 반려될 수 있습니다.",
  "환불 요청이 반려되면 예약 상세 페이지에서 관리자 반려 사유를 확인할 수 있습니다.",
  "결제 수단에 따라 환불 완료까지 영업일 기준 일정 기간이 소요될 수 있습니다.",
];

// 예약 취소(환불 요청) 모달 - 예약 목록/상세 페이지에서 공통으로 사용한다
export default function RefundRequestModal({
  reservation,
  onCancel,
  onConfirm,
}: RefundRequestModalProps) {
  const [reason, setReason] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const reasonError = getRefundReasonError(reason);
  const canSubmit = !reasonError && agreed && !submitting;

  const refundRate = getRefundRate(reservation.daysUntilDeparture);
  const estimatedAmount =
    refundRate === null ? null : Math.round((reservation.paidAmount * refundRate) / 100);

  const handleConfirm = () => {
    if (!canSubmit) return;
    setSubmitting(true);
    onConfirm(reason.trim());
  };

  return (
    <div className="fixed inset-0 z-[9999] flex min-h-dvh items-center justify-center overflow-y-auto bg-black/50 px-4 py-8">
      <div className="flex w-full max-w-[480px] flex-col overflow-hidden rounded-2xl bg-white shadow-xl max-h-[88vh]">
        <div className="shrink-0 border-b border-[#E5EDF5] px-5 py-4">
          <h2 className="text-lg font-extrabold text-[#0A1628]">
            환불을 요청할까요?
          </h2>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {/* A. 예약 기본 정보 */}
          <section className="rounded-2xl border border-[#E5EDF5] bg-[#F8FBFD] p-3">
            <p className="text-sm font-bold text-[#0A1628]">
              {reservation.packageName}
            </p>
            <dl className="mt-2 space-y-1 text-xs text-[#344054]">
              <div className="flex justify-between">
                <dt className="text-[#8A9BB0]">예약 번호</dt>
                <dd>{reservation.reservationNumber}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-[#8A9BB0]">출발일</dt>
                <dd>{reservation.startDate}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-[#8A9BB0]">결제 방식</dt>
                <dd>{PAYMENT_TYPE_LABEL[reservation.paymentType]}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-[#8A9BB0]">결제 완료 금액</dt>
                <dd className="font-bold text-[#0A1628]">
                  {reservation.paidAmount.toLocaleString()}원
                </dd>
              </div>
            </dl>
          </section>

          {/* B. 환불 예상 정보 */}
          <section className="mt-3 rounded-2xl border border-[#E5EDF5] p-3">
            <p className="text-xs font-bold text-[#439A97]">💰 환불 예상 정보</p>
            <p className="mt-1 text-sm text-[#0A1628]">
              예상 환불 금액{" "}
              <span className="font-bold text-[#439A97]">
                {estimatedAmount === null
                  ? "관리자 검토 후 안내"
                  : `${estimatedAmount.toLocaleString()}원 (${refundRate}%)`}
              </span>
            </p>
            <p className="mt-1 text-xs leading-5 text-[#8A9BB0]">
              실제 환불 금액은 관리자 검토 후 달라질 수 있습니다. 결제 수단에
              따라 환불 완료까지 영업일 기준 3~5일이 소요될 수 있습니다.
            </p>
          </section>

          {/* C. 환불 요청 사유 입력 */}
          <section className="mt-3">
            <label
              htmlFor="refund-reason"
              className="text-sm font-bold text-[#0A1628]"
            >
              환불 요청 사유 <span className="text-[#B54747]">*</span>
            </label>
            <textarea
              id="refund-reason"
              value={reason}
              onChange={(event) => setReason(event.target.value)}
              placeholder={
                "환불을 요청하는 사유를 자세히 작성해 주세요.\n예: 개인 일정 변경으로 여행 참여가 어려워졌습니다."
              }
              rows={4}
              aria-describedby="refund-reason-error refund-reason-count"
              aria-invalid={reason.length > 0 && reasonError !== null}
              className="mt-1.5 w-full resize-none rounded-2xl border border-[#E5EDF5] p-3 text-sm text-[#0A1628] outline-none focus:border-[#439A97]"
            />
            <div className="mt-1 flex items-center justify-between">
              <p
                id="refund-reason-error"
                role="alert"
                aria-live="polite"
                className="text-xs text-[#B54747]"
              >
                {reason.length > 0 ? reasonError : ""}
              </p>
              <p id="refund-reason-count" className="shrink-0 text-xs text-[#8A9BB0]">
                {reason.trim().length} / {REFUND_REASON_MAX_LENGTH}
              </p>
            </div>
          </section>

          {/* D. 환불 전 확인 사항 */}
          <section className="mt-3 rounded-2xl bg-[#F8FBFD] p-3">
            <p className="text-xs font-bold text-[#0A1628]">📋 환불 전 확인 사항</p>
            <ul className="mt-1.5 space-y-1 text-xs leading-5 text-[#344054]">
              {GUIDE_LINES.map((line) => (
                <li key={line} className="flex gap-1.5">
                  <span className="text-[#439A97]">·</span>
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* E. 확인 체크박스 */}
          <label className="mt-3 flex cursor-pointer items-start gap-2">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(event) => setAgreed(event.target.checked)}
              className="mt-0.5 h-4 w-4 accent-[#439A97]"
            />
            <span className="text-sm text-[#0A1628]">
              환불 규정과 안내 사항을 모두 확인했습니다.
            </span>
          </label>
        </div>

        {/* F. 하단 버튼 */}
        <div className="flex shrink-0 gap-3 border-t border-[#E5EDF5] px-5 py-4">
          <button
            type="button"
            onClick={onCancel}
            className="h-[42px] flex-1 rounded-xl border border-[#D1D5DB] bg-white text-sm font-semibold text-[#4B5563] transition-colors hover:bg-gray-50"
          >
            돌아가기
          </button>
          <button
            type="button"
            disabled={!canSubmit}
            onClick={handleConfirm}
            className="h-[42px] flex-1 rounded-xl bg-[#D95C5C] text-sm font-semibold text-white transition-colors hover:bg-[#BF4747] disabled:cursor-not-allowed disabled:bg-[#D0D5DD]"
          >
            환불 요청
          </button>
        </div>
      </div>
    </div>
  );
}
