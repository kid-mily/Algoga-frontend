"use client";

import { useState } from "react";
import CancellationPolicyModal from "@/features/payment/CancellationPolicyModal";

export default function CancellationPolicyClient() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <button
        type="button"
        className="mt-6 h-14 w-full cursor-pointer rounded-2xl border border-[#E5EAF2] text-[#3366CC] font-medium"
        onClick={() => setIsOpen(true)}
      >
        환불 정책 확인하기
      </button>

      {isOpen ? (
        <CancellationPolicyModal onClose={() => setIsOpen(false)} />
      ) : null}
    </div>
  );
}