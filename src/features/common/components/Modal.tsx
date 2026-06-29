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
  title = "제목",
  description = "정말 ~하시겠습니까?",
  confirmText = "확인",
  cancelText = "취소",
  confirmDisabled = false,
  onConfirm,
  onCancel,
}: ModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40">
      <div className="w-[360px] overflow-hidden rounded-[16px] bg-white shadow-xl">
        {/* Header */}
        <div className="border-b border-[#D9DEE5] px-5 py-3">
          <h2 className="text-[22px] font-bold text-[#2F3640]">
            {title}
          </h2>
        </div>

        {/* Content */}
        <div className="flex flex-col items-center justify-center px-5 py-6">
          <p className="text-center text-[18px] text-[#6B7280]">
            {description}
          </p>

          {/* Buttons */}
          <div className="mt-8 flex gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="h-[42px] w-[140px] rounded-[12px] border border-[#D1D5DB] bg-white text-[15px] font-semibold text-[#4B5563] transition hover:bg-gray-50"
            >
              {cancelText}
            </button>

            <button
              type="button"
              disabled={confirmDisabled}
              onClick={onConfirm}
              className="h-[42px] w-[140px] rounded-[12px] bg-[#439A97] text-[15px] font-semibold text-white transition-colors duration-200 hover:bg-[#367c79] disabled:cursor-not-allowed disabled:bg-[#D0D5DD]"
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}