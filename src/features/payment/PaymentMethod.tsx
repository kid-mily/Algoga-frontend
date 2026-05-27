'use client'

import { useState } from "react";

const paymentMethods = [
    {
        id: 1,
        title: "신용 / 체크카드",
        description: "국내 모든 카드 사용 가능",
    },
    {
        id: 2,
        title: "계좌이체",
        description: "실시간 계좌이체 결제",
    },
    {
        id: 3,
        title: "카카오페이",
        description: "간편 결제",
    },
];

export default function PaymentMethod() {
    const [selectedMethod, setSelectedMethod] = useState(1);

    return (
        <div className="bg-white rounded-2xl border border-[#E8EEF5] p-6 shadow-sm flex flex-col mt-5">
            {/* 타이틀 */}
            <div className="flex items-center mb-5">
                <img src="/images/Payment.svg" alt="결제" />
                <h1 className="ml-2 font-bold text-[#0A1628]">결제 수단</h1>
            </div>
            
            {/* 결제 목록 */}
            <div className="flex flex-col gap-3">
                {paymentMethods.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => setSelectedMethod(item.id)}
                        className={`w-full rounded-2xl border p-5 text-left ${
                            selectedMethod === item.id
                            ? "border-[#5E908D] bg-[#F4FBFA]"
                            : "border-[#E5EAF2] bg-white"
                        }`}
                    >
                        <p className="font-bold text-[#0A1628]">{item.title}</p>
                        <p className="text-sm text-[#8A9BB0] mt-1">{item.description}</p>
                    </button>
                ))}
            </div>
        </div>
    );
}