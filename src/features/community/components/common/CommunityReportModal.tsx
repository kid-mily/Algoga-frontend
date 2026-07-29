"use client";

import { useState } from "react";
import {
  REPORT_REASONS,
  type CommunityReportModalProps,
  type CommunityReportReasonType,
} from "@/features/community/types";

export default function CommunityReportModal({
  open,
  targetType,
  isPending = false,
  onCancel,
  onSubmit,
}: CommunityReportModalProps) {
  const [reasonType, setReasonType] = useState<CommunityReportReasonType>("SPAM");
  const [detail, setDetail] = useState("");

  if (!open) return null;

  const handleSubmit = () => {
    onSubmit({
      reasonType,
      detail: detail.trim(),
    });
  };

  return (
    <div className="fixed inset-0 z-[5000] flex items-center justify-center bg-black/35 px-4">
      <div
        role="dialog"
        aria-modal="true"
        className="w-full max-w-lg rounded-[14px] border border-[#CFE0DE] bg-[#FFFDF8] p-6 shadow-[0_18px_42px_rgba(47,42,38,0.18)]"
      >
        <h2 className="text-[20px] font-extrabold text-[#2F2A26]">
          신고하기
        </h2>

        <div className="mt-5">
          <p className="text-sm font-bold text-[#5F928E]">신고대상</p>
          <p className="mt-2 rounded-[10px] border border-[#CFE0DE] bg-white px-4 py-3 text-sm font-bold text-[#2F2A26]">
            {targetType}
          </p>
        </div>

        <div className="mt-5">
          <p className="text-sm font-bold text-[#5F928E]">신고사유</p>
          <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
            {REPORT_REASONS.map((reason) => {
              const isSelected = reasonType === reason.value;

              return (
                <button
                  key={reason.value}
                  type="button"
                  onClick={() => setReasonType(reason.value)}
                  className={`h-10 cursor-pointer rounded-[10px] border px-3 text-sm font-bold transition ${
                    isSelected
                      ? "border-[#6BA19D] bg-[#6BA19D] text-white"
                      : "border-[#CFE0DE] bg-white text-[#7A6F66] hover:bg-[#EEF4F4]"
                  }`}
                >
                  {reason.label}
                </button>
              );
            })}
          </div>
        </div>

        <label className="mt-5 block">
          <span className="text-sm font-bold text-[#5F928E]">상세내용</span>
          <textarea
            value={detail}
            onChange={(event) => setDetail(event.target.value.slice(0, 500))}
            placeholder="신고 내용을 입력해주세요."
            className="mt-3 h-32 w-full resize-none rounded-[10px] border border-[#CFE0DE] bg-white px-4 py-3 text-sm font-semibold leading-6 text-[#2F2A26] outline-none placeholder:text-[#9A8B7D] focus:border-[#6BA19D]"
          />
          <span className="mt-1 block text-right text-xs font-semibold text-[#9A8B7D]">
            {detail.length}/500
          </span>
        </label>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={isPending}
            className="h-11 cursor-pointer rounded-[10px] border border-[#CFE0DE] bg-white text-sm font-bold text-[#7A6F66] transition hover:bg-[#F8F5EF] disabled:cursor-not-allowed disabled:opacity-60"
          >
            취소
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isPending || !detail.trim()}
            className="h-11 cursor-pointer rounded-[10px] bg-[#6BA19D] text-sm font-bold text-white transition hover:bg-[#5F928E] disabled:cursor-not-allowed disabled:bg-[#CFE0DE]"
          >
            {isPending ? "신고 중" : "신고하기"}
          </button>
        </div>
      </div>
    </div>
  );
}
