interface Props {
    finalAmount: number;
    isPaying: boolean;
    onBack: () => void;
    onPay: () => void;
}

export function PaymentButtons({ finalAmount, isPaying, onBack, onPay }: Props) {
    return (
        <div className="flex gap-3 w-full">
            <button
                type="button"
                onClick={onBack}
                className="h-16 px-6 rounded-3xl border border-[#DCE3EA] bg-white font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
            >
                이전
            </button>
            <button
                type="button"
                disabled={isPaying} 
                onClick={onPay}
                className="h-16 flex-1 rounded-3xl bg-[#5E908D] font-bold text-white disabled:opacity-50 hover:bg-[#4d7875] transition-colors"
            >
                {isPaying
                    ? "결제 처리 중..."
                    : finalAmount === 0 
                    ? "전액 할인 결제하기" 
                    : `${finalAmount.toLocaleString()}원 토스페이 결제`
                }
            </button>
        </div>
    );
}