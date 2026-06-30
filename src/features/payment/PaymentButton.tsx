interface Props {
    finalAmount: number;
    isPaying: boolean;
    onBack: () => void;
    onPay: () => void;
    continentCode: string;
}

export function PaymentButtons({
    finalAmount,
    isPaying,
    onBack,
    onPay,
    }: Props) {
    return (
        <div className="grid gap-3 sm:grid-cols-[112px_1fr]">
        <button
            type="button"
            onClick={onBack}
            className="h-14 rounded-2xl border border-[#DCE3EA] bg-white text-sm font-bold text-[#667085] transition hover:bg-[#F8FAFC]"
        >
            이전
        </button>

        <button
            type="button"
            disabled={isPaying}
            onClick={onPay}
            className="h-14 cursor-pointer rounded-2xl bg-[#439A97] px-5 text-sm font-bold text-white transition hover:bg-[#357F7C] disabled:cursor-not-allowed disabled:bg-[#A8C8C6]"
        >
            {isPaying
            ? "결제 처리 중..."
            : finalAmount === 0
                ? "전액 할인 결제하기"
                : "토스페이로 결제하기"}
        </button>
        </div>
    );
}