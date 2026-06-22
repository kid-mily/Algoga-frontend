"use client";

interface CheckModalProps {
  open: boolean;
  title?: string;
  description?: string;
  buttonText?: string;
  cancelText?: string;
  isProcessing?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export default function CheckModal({
  open,
  title = "완료할까요?",
  description = "내용을 확인해 주세요.",
  buttonText = "확인",
  cancelText = "취소",
  isProcessing = false,
  onCancel,
  onConfirm,
}: CheckModalProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#0A1628]/45 px-4 backdrop-blur-[2px]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="check-modal-title"
      onMouseDown={(event) => {
        if (
          event.target === event.currentTarget &&
          !isProcessing
        ) {
          onCancel();
        }
      }}
    >
      <section className="w-full max-w-[400px] overflow-hidden rounded-[24px] bg-white shadow-2xl">
        {/* 여행 티켓 상단 */}
        <div className="relative bg-[#EAF5F4] px-6 pb-5 pt-6 text-center">
          <div className="absolute -left-3 bottom-[-12px] h-6 w-6 rounded-full bg-[#0A1628]/45" />
          <div className="absolute -right-3 bottom-[-12px] h-6 w-6 rounded-full bg-[#0A1628]/45" />

          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#439A97] text-xl text-white shadow-sm">
            ✈
          </div>

          <p className="mt-3 text-[10px] font-bold tracking-[0.18em] text-[#439A97]">
            ALGOGA
          </p>
        </div>

        <div className="border-t border-dashed border-[#D6E3E7] px-6 pb-6 pt-5">
          <div className="text-center">
            <h2 className="text-xl font-bold text-[#0A1628]"
            >
              {title}
            </h2>

            <p className="mt-2 text-sm leading-6 text-[#8A94A6]">
              {description}
            </p>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <button
              type="button"
              disabled={isProcessing}
              onClick={onCancel}
              className="h-11 rounded-xl border border-[#D9E2E8] bg-white text-sm font-bold text-[#243247] transition hover:bg-[#F6F9FB] cursor-pointer"
            >
              {cancelText}
            </button>

            <button
              type="button"
              disabled={isProcessing}
              onClick={onConfirm}
              className="h-11 rounded-xl bg-[#439A97] text-sm font-bold text-white shadow-sm transition hover:bg-[#357A78] coursor-pointer"
            >
              {buttonText}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
} 