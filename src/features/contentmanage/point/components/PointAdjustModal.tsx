"use client";

import { FormEvent, useState } from "react";
import { PointAdjustMode } from "../types";

interface PointAdjustModalProps {
  open: boolean;
  mode: PointAdjustMode;
  studentName: string;
  currentPoint: number;
  onClose: () => void;
  onSubmit: (amount: number, reason: string) => Promise<boolean>;
}

const getModeText = (mode: PointAdjustMode) => {
  return mode === "give"
    ? {
        title: "마일리지 지급",
        target: "지급",
        amountLabel: "지급 금액 (원)",
        amountPlaceholder: "지급할 마일리지를 입력하세요",
        reasonLabel: "지급 사유",
        reasonPlaceholder: "지급 사유를 입력하세요",
        nextLabel: "지급 후 예상마일리지",
        submit: "지급하기",
        panelClass: "bg-[#ECFDF3]",
        labelClass: "text-[#98A2B3]",
        valueClass: "text-[#439A97]",
        buttonClass: "bg-[#439A97] hover:opacity-90",
        disabledClass: "bg-[#CFE5E4]",
      }
    : {
        title: "마일리지 회수",
        target: "회수",
        amountLabel: "회수 금액 (원)",
        amountPlaceholder: "회수할 마일리지를 입력하세요",
        reasonLabel: "회수 사유",
        reasonPlaceholder: "회수 사유를 입력하세요",
        nextLabel: "회수 후 예상마일리지",
        submit: "회수하기",
        panelClass: "border border-[#FECACA] bg-[#FEF2F2]",
        labelClass: "text-[#EF4444]",
        valueClass: "text-[#DC2626]",
        buttonClass: "bg-[#DC2626] hover:bg-[#B91C1C]",
        disabledClass: "bg-[#F5CACA]",
      };
};

export default function PointAdjustModal({
  open,
  mode,
  studentName,
  currentPoint,
  onClose,
  onSubmit,
}: PointAdjustModalProps) {
  const [amount, setAmount] = useState("");
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const modeText = getModeText(mode);
  const displayName = studentName.trim() || "선택한 사용자";

  const amountValue = Number(amount || 0);
  const isRecallOverLimit = mode === "recall" && amountValue > currentPoint;
  const isActive =
    amountValue > 0 && reason.trim() !== "" && !isRecallOverLimit;
  const nextPoint =
    mode === "give" ? currentPoint + amountValue : currentPoint - amountValue;

  if (!open) {
    return null;
  }

  const resetForm = () => {
    setAmount("");
    setReason("");
    setIsSubmitting(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isActive) {
      return;
    }

    setIsSubmitting(true);
    try {
      const success = await onSubmit(amountValue, reason.trim());

      if (success) {
        resetForm();
      }
    } catch (submitError) {
      console.error("마일리지 조정 실패:", submitError);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <aside
      role="dialog"
      aria-modal="true"
      aria-labelledby="point-adjust-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
    >
      <form
        onSubmit={handleSubmit}
        className="flex h-[760px] w-full max-w-[520px] flex-col rounded-[28px] bg-white shadow-xl"
      >
        <header className="flex items-start justify-between px-7 pt-7">
          <section>
            <h2
              id="point-adjust-title"
              className="text-[28px] font-bold text-[#111827]"
            >
              {modeText.title}
            </h2>
            <p className="mt-2 text-[15px] text-[#98A2B3]">
              {displayName}님에게 {modeText.target}
            </p>
          </section>

          <button
            type="button"
            onClick={handleClose}
            className="text-[24px] text-[#98A2B3]"
            aria-label="마일리지 모달 닫기"
          >
            x
          </button>
        </header>

        <section className="flex-1 px-7 py-6">
          <section className={`rounded-[18px] p-5 ${modeText.panelClass}`}>
            <p className={`text-[14px] font-medium ${modeText.labelClass}`}>
              현재 보유 마일리지
            </p>
            <p className={`mt-2 text-[42px] font-bold ${modeText.valueClass}`}>
              {currentPoint.toLocaleString()}원
            </p>
          </section>

          <section className="mt-7">
            <label
              htmlFor="point-adjust-amount"
              className="text-[15px] font-semibold text-[#111827]"
            >
              {modeText.amountLabel}
            </label>
            <input
              id="point-adjust-amount"
              type="number"
              min={1}
              max={mode === "recall" ? currentPoint : undefined}
              placeholder={modeText.amountPlaceholder}
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
              className="mt-3 h-[56px] w-full rounded-[16px] border border-[#E4E7EC] px-4 text-[15px] outline-none"
            />
          </section>

          <p
            role={isRecallOverLimit ? "alert" : undefined}
            className={`mt-3 min-h-[20px] text-[13px] font-medium ${
              isRecallOverLimit ? "text-[#DC2626]" : "text-transparent"
            }`}
          >
            보유 마일리지보다 많이 회수할 수 없습니다.
          </p>

          <section className="mt-6">
            <label
              htmlFor="point-adjust-reason"
              className="text-[15px] font-semibold text-[#111827]"
            >
              {modeText.reasonLabel}
            </label>
            <textarea
              id="point-adjust-reason"
              placeholder={modeText.reasonPlaceholder}
              value={reason}
              onChange={(event) => setReason(event.target.value)}
              className="mt-3 h-[120px] w-full resize-none rounded-[16px] border border-[#E4E7EC] px-4 py-4 text-[15px] outline-none"
            />
          </section>
          <section
            aria-hidden={!isActive}
            className={`mt-6 min-h-[128px] rounded-[18px] p-5 transition-opacity ${
              isActive ? `${modeText.panelClass} opacity-100` : "bg-transparent opacity-0"
            }`}
          >
            <p className={`text-[14px] font-medium ${modeText.labelClass}`}>
              {modeText.nextLabel}
            </p>
            <p className={`mt-2 text-[36px] font-bold ${modeText.valueClass}`}>
              {nextPoint.toLocaleString()}원
            </p>
          </section>
        </section>

        <footer className="flex items-center justify-end gap-3 border-t border-[#E4E7EC] px-7 py-5">
          <button
            type="button"
            onClick={handleClose}
            className="h-[52px] rounded-[14px] border border-[#E4E7EC] px-8 text-[15px] font-semibold text-[#344054]"
          >
            취소
          </button>
          <button
            type="submit"
            disabled={!isActive || isSubmitting}
            className={`h-[52px] rounded-[14px] px-8 text-[15px] font-semibold text-white transition ${
              isActive && !isSubmitting
                ? modeText.buttonClass
                : modeText.disabledClass
            }`}
          >
            {isSubmitting ? "처리 중..." : modeText.submit}
          </button>
        </footer>
      </form>
    </aside>
  );
}



