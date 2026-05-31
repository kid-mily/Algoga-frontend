"use client";

import { useState } from "react";

interface GiveFormProps {
  open: boolean;
  studentName: string;
  currentPoint: number;
  onClose: () => void;
  onSubmit?: (
    amount: number,
    reason: string
  ) => void;
}

export default function GiveForm({
  open,
  studentName,
  currentPoint,
  onClose,
  onSubmit,
}: GiveFormProps) {

  const [amount, setAmount] =
    useState("");

  const [reason, setReason] =
    useState("");

  // 활성화 여부
  const isActive =
    amount.trim() !== "" &&
    reason.trim() !== "";

  // 지급 후 예상 포인트
  const nextPoint = currentPoint + Number(amount || 0);

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      {/* 모달 */}
      <div className="w-full max-w-[520px] rounded-[28px] bg-white shadow-xl">
        {/* 헤더 */}
        <div className="flex items-start justify-between px-7 pt-7">

          <div>
            <h2 className="text-[28px] font-bold text-[#111827]">
              마일리지 지급
            </h2>
            <p className="mt-2 text-[15px] text-[#98A2B3]">
              {studentName}님에게 지급
            </p>
          </div>

          {/* 닫기 */}
          <button
            type="button"
            onClick={onClose}
            className="text-[24px] text-[#98A2B3]"
          >
            ×
          </button>
        </div>

        {/* body */}
        <div className="px-7 py-6">
          {/* 현재 포인트 */}
          <div className="rounded-[18px] bg-[#ECFDF3] p-5">
            <p className="text-[14px] font-medium text-[#98A2B3]">
              현재 보유 마일리지
            </p>
            <p className="mt-2 text-[42px] font-bold text-[#439A97]">
              {currentPoint.toLocaleString()}원
            </p>
          </div>

          {/* 지급 금액 */}
          <div className="mt-7">
            <label className="text-[15px] font-semibold text-[#111827]">
              지급 금액 (원)
            </label>

            <input
              type="number"
              placeholder="지급할 마일리지를 입력하세요"
              value={amount}
              onChange={(e) => setAmount(
                  e.target.value
                )
              }
              className="mt-3 h-[56px] w-full rounded-[16px] border border-[#E4E7EC] px-4 text-[15px] outline-none"
            />
          </div>

          {/* 지급 사유 */}
          <div className="mt-6">
            <label className="text-[15px] font-semibold text-[#111827]">
              지급 사유
            </label>
            <textarea
              placeholder="지급 사유를 입력하세요"
              value={reason}
              onChange={(e) => setReason(
                  e.target.value
                )
              }
              className="mt-3 h-[120px] w-full resize-none rounded-[16px] border border-[#E4E7EC] px-4 py-4 text-[15px] outline-none"
            />
          </div>

          {/* 예상 포인트 */}
          {isActive && (
            <div className="mt-6 rounded-[18px] bg-[#ECFDF3] p-5">
              <p className="text-[14px] font-medium text-[#98A2B3]">
                지급 후 예상마일리지
              </p>
              <p className="mt-2 text-[36px] font-bold text-[#439A97]">
                {nextPoint.toLocaleString()}원
              </p>
            </div>
          )}
        </div>

        {/* footer */}
        <div className="flex items-center justify-end gap-3 border-t border-[#E4E7EC] px-7 py-5">
          <button
            type="button"
            onClick={onClose}
            className="h-[52px] rounded-[14px] border border-[#E4E7EC] px-8 text-[15px] font-semibold text-[#344054]"
          >
            취소
          </button>

          <button
            type="button"
            disabled={!isActive}
            onClick={() => onSubmit?.(
                Number(amount),
                reason
              )
            }

            className={`h-[52px] rounded-[14px] px-8 text-[15px] font-semibold text-white transition ${
              isActive
                ? "bg-[#439A97] hover:opacity-90"
                : "bg-[#CFE5E4]"
            }`}
          >
            지급하기
          </button>
        </div>
      </div>
    </div>
  );
}