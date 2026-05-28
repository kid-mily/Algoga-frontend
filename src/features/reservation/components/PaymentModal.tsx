'use client';

interface PaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onFullPayment: () => void;
    onDivisionPayment: () => void;
}

export default function PaymentModal({
    isOpen,
    onClose,
    onFullPayment,
    onDivisionPayment,
}: PaymentModalProps) {

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="w-96 rounded-3xl bg-white p-6">

                {/* 제목 */}
                <h2 className="text-xl font-bold text-center text-[#0A1628]">
                    결제 방식을 선택해주세요
                </h2>
                <p className="text-sm text-gray-500 text-center mt-2">
                    원하는 결제 방식을 선택해주세요.
                </p>

                {/* 버튼 */}
                <div className="flex flex-col gap-3 mt-6">

                    {/* 한번에 결제 */}
                    <button
                        onClick={onFullPayment}
                        className="h-14 rounded-2xl bg-[#5E908D] text-white font-bold hover:bg-[#4F7F7C] transition"
                    >
                        한번에 결제
                    </button>

                    {/* 분할 결제 */}
                    <button
                        onClick={onDivisionPayment}
                        className="h-14 rounded-2xl border border-[#5E908D] text-[#5E908D] font-bold hover:bg-[#F3F7F7] transition"
                    >
                        분할 결제
                    </button>

                    {/* 닫기 */}
                    <button
                        onClick={onClose}
                        className="mt-2 text-sm text-gray-400 hover:text-gray-600"
                    >
                        닫기
                    </button>

                </div>
            </div>
        </div>
    );
}