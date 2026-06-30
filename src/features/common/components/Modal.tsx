interface ModalProps {
  open: boolean;
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  confirmDisabled?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function Modal({
  open,
  title = "알림",
  description = "정말 진행하시겠습니까?",
  confirmText = "확인",
  cancelText = "취소",
  confirmDisabled = false,
  onConfirm,
  onCancel,
}: ModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex min-h-dvh items-center justify-center overflow-y-auto bg-black/50 px-4 py-8">
      <div className="w-full max-w-[360px] overflow-hidden rounded-[16px] bg-white shadow-xl">
        <div className="border-b border-[#D9DEE5] px-5 py-3">
          <h2 className="text-[22px] font-bold text-[#2F3640]">
            {title}
          </h2>
        </div>

        <div className="flex flex-col items-center justify-center px-5 py-6">
          <p className="whitespace-pre-line text-center text-[16px] leading-7 text-[#6B7280]">
            {description}
          </p>

          <div className="mt-8 flex w-full gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="h-[42px] flex-1 rounded-[12px] border border-[#D1D5DB] bg-white text-[15px] font-semibold text-[#4B5563] transition hover:bg-gray-50"
            >
              {cancelText}
            </button>

            <button
              type="button"
              disabled={confirmDisabled}
              onClick={onConfirm}
              className="h-[42px] flex-1 rounded-[12px] bg-[#439A97] text-[15px] font-semibold text-white transition hover:bg-[#367c79] disabled:cursor-not-allowed disabled:bg-[#D0D5DD]"
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}