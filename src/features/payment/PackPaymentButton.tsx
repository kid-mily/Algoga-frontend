'use client'

import { useParams, useRouter } from "next/navigation";

export default function PackPaymentButton() {

    const router = useRouter();
    const { continentid, countryid } = useParams();
    return (
        <div className="flex gap-4 mt-5">
            <button className="flex-1 h-16 rounded-2xl border border-[#DCE3EA] bg-white font-semibold text-[#0A1628] cursor-pointer"
                onClick={() => {router.push('에약 페이지 주소로 변경')}}
            >
            이전
            </button>
            <button className="flex-1 h-16 rounded-2xl bg-[#5E908D] text-white font-bold hover:bg-[#4F7F7C] transition cursor-pointer">
                74,000원 결제하기
            </button>
        </div>
    );
}