interface BalancePaymentConfirmModalProps {
  amount: number;
  dueDate?: string;
  isPaying: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export default function BalancePaymentConfirmModal({
  amount,
  dueDate,
  isPaying,
  onCancel,
  onConfirm,
}: BalancePaymentConfirmModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="balance-payment-title"
        className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl"
      >
        <h2 id="balance-payment-title" className="text-lg font-extrabold text-[#0A1628]">
          잔금을 결제할까요?
        </h2>
        <p className="mt-2 text-sm text-[#718096]">
          아래 금액으로 결제가 진행됩니다.
        </p>

        <div className="mt-5 rounded-xl bg-[#EEF8F7] p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-[#0A1628]">잔금 결제 금액</span>
            <strong className="text-xl text-[#439A97]">
              {amount.toLocaleString()}원
            </strong>
          </div>
          {dueDate && (
            <p className="mt-2 text-xs text-[#56706F]">결제 기한 {dueDate}</p>
          )}
        </div>

        <p className="mt-4 text-xs leading-5 text-[#718096]">
          결제를 완료하면 예약이 ‘전액 결제 완료’ 상태로 변경됩니다.
        </p>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={isPaying}
            className="rounded-xl border border-[#E1E8EF] py-3 text-sm font-bold text-[#718096] disabled:opacity-50"
          >
            취소
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isPaying}
            className="rounded-xl bg-[#439A97] py-3 text-sm font-bold text-white disabled:opacity-50"
          >
            {isPaying ? "결제 처리 중..." : "결제하기"}
          </button>
        </div>
      </section>
    </div>
  );
}
