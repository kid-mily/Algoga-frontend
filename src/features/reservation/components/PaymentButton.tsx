'use client';

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

import PaymentModal from "./PaymentModal";

export default function ReservationPaymentButton() {

    const router = useRouter();

    const { continentid, countryid, lectureid } = useParams();

    const [isOpen, setIsOpen] = useState(false);

    // 모달 열기
    const onOpenModal = () => {
        setIsOpen(true);
    };

    // 모달 닫기
    const onCloseModal = () => {
        setIsOpen(false);
    };

    // 한번에 결제
    const onFullPayment = () => {
        router.push(
            `/classroom/${continentid}/${countryid}/lecture/${lectureid}/payment/package/full`
        );
    };

    // 분할 결제
    const onDivisionPayment = () => {
        router.push(
            `/classroom/${continentid}/${countryid}/lecture/${lectureid}/payment/package/division/first`
        );
    };

    return (
        <>
            <div className="flex gap-4 mt-5">
                <button
                    onClick={onOpenModal}
                    className="flex-1 h-16 rounded-2xl bg-[#5E908D] text-white font-bold hover:bg-[#4F7F7C] transition cursor-pointer"
                >
                    결제하기
                </button>
            </div>

            <PaymentModal
                isOpen={isOpen}
                onClose={onCloseModal}
                onFullPayment={onFullPayment}
                onDivisionPayment={onDivisionPayment}
            />
        </>
    );
}