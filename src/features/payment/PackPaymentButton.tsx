'use client'

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import CheckModal from "../common/CheckModal";

export default function PackPaymentButton() {

    const router = useRouter();
    const [open, setOpen] = useState(false);

    // 완료 모달 열기
    const onOpenModal = () => {
        setOpen(true);
    };

    const onConfirm = () => {
        setOpen(false);
        router.push('/')
    };


    return (
        <div className="flex gap-4 mt-5">
            <button className="flex-1 h-16 rounded-2xl border border-[#DCE3EA] bg-white font-semibold text-[#0A1628] cursor-pointer"
                onClick={() => {router.push('/classroom/packagelounge/reservation')}}
            >
            이전
            </button>
            <button className="flex-1 h-16 rounded-2xl bg-[#5E908D] text-white font-bold hover:bg-[#4F7F7C] transition cursor-pointer"
            onClick={onOpenModal}
            >
                결제하기
            </button>

            {/* 결제 완료 모달 */}
            <CheckModal
                open={open}
                title="결제가 완료되었습니다"
                description="예약과 결제가 완료되었습니다."
                buttonText="확인"
                onCancel={() => setOpen(false)}
                onConfirm={onConfirm}
            />
        </div>
    );
}