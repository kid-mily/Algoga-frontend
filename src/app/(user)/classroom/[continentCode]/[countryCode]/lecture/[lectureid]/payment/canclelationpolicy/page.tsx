'use client'

import CancellationPolicyModal from "@/features/payment/CancellationPolicyModal";
import { useState } from "react";

export default function CanclelationPolicy() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div>
            <button className="w-full h-14 border border-[#E5EAF2] rounded-2xl mt-6 text-[#3366CC] font-medium cursor-pointer"
            onClick={() => setIsOpen(true)}>
                환불정책 확인하기
            </button>

            {/* 모달 */}
            {isOpen && (
                <CancellationPolicyModal onClose={() => setIsOpen(false)}/>
            )}
        </div>
    );
}