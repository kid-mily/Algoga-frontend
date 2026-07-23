"use client";

import { useEffect, useRef, useState } from "react";
import { REFUND_POLICY, REFUND_POLICY_NOTICE } from "../booking.data";

const TONE_CLASS: Record<string, string> = {
  good: "bg-[#EEF8F7] text-[#357F7C]",
  mid: "bg-[#FFF8E8] text-[#A87512]",
  bad: "bg-[#FDECEC] text-[#B54747]",
};

interface BookingPolicyProps {
  // 동의 여부가 바뀔 때마다 상위 컴포넌트(다음 버튼)에 알려준다
  onAgreedChange?: (agreed: boolean) => void;
  // 값이 바뀔 때마다(1, 2, 3...) 동의하지 않은 상태면 오류를 보여주고 체크박스로 이동한다
  validateSignal?: number;
}

// 예약 03단계: 취소/환불 정책 안내 + 확인 체크박스
export default function BookingPolicy({
  onAgreedChange,
  validateSignal,
}: BookingPolicyProps) {
  const [agreed, setAgreed] = useState(false);
  const [showError, setShowError] = useState(false);
  const agreedRef = useRef(agreed);
  const checkboxRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    agreedRef.current = agreed;
  }, [agreed]);

  const handleAgreedChange = (checked: boolean) => {
    setAgreed(checked);
    onAgreedChange?.(checked);
  };

  // 다음 단계 버튼을 동의하지 않은 채로 눌렀을 때(validateSignal 증가) 오류를 보여주고 체크박스로 이동한다
  useEffect(() => {
    if (!validateSignal) return;
    if (agreedRef.current) return;

    setShowError(true);
    checkboxRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [validateSignal]);

  return (
    <section className="rounded-2xl border border-[#E1E8EF] bg-white p-5 shadow-[0_8px_24px_rgba(55,88,110,0.06)] sm:p-6">
      <span className="text-[10px] font-bold tracking-[0.16em] text-[#A0AEC0]">
        POLICY
      </span>
      <h2 className="mt-1 text-lg font-bold text-[#0A1628]">예약 조건 확인</h2>

      <div className="mt-4">
        <div className="flex items-center justify-between">
          <p className="text-sm font-bold text-[#0A1628]">취소 및 환불 규정</p>
          <button
            type="button"
            className="text-xs font-semibold text-[#439A97] hover:underline"
          >
            전체 정책 보기
          </button>
        </div>

        <p className="mt-2 text-xs leading-5 text-[#B54747]">
          {REFUND_POLICY_NOTICE}
        </p>

        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
          {REFUND_POLICY.map((policy) => (
            <div
              key={policy.label}
              className={`rounded-xl p-4 ${TONE_CLASS[policy.tone]}`}
            >
              <p className="text-xs font-medium opacity-80">{policy.label}</p>
              <p className="mt-1 text-sm font-bold">{policy.description}</p>
            </div>
          ))}
        </div>

        <label className="mt-5 flex cursor-pointer items-center gap-2">
          <input
            ref={checkboxRef}
            type="checkbox"
            checked={agreed}
            onChange={(event) => handleAgreedChange(event.target.checked)}
            className="h-4 w-4 accent-[#439A97]"
          />
          <span className="text-sm text-[#0A1628]">
            취소 및 환불 규정을 확인했습니다.
          </span>
        </label>

        {showError && !agreed && (
          <p className="mt-2 text-xs text-[#D9534F]">
            취소 및 환불 규정에 동의한 후 다음 단계로 진행해 주세요.
          </p>
        )}
      </div>
    </section>
  );
}
