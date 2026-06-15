type UserActivityConfirmModalProps = {
  open: boolean;
  title: string;
  description: string;
  isProcessing?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

export default function UserActivityConfirmModal({
  open,
  title,
  description,
  isProcessing = false,
  onCancel,
  onConfirm,
}: UserActivityConfirmModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <section className="w-full max-w-[420px] rounded-[16px] bg-white p-6 shadow-xl" role="dialog" aria-modal="true" aria-labelledby="user-activity-confirm-title">
        <h2 id="user-activity-confirm-title" className="text-[20px] font-bold text-[#111827]">
          {title}
        </h2>
        <p className="mt-3 text-[14px] leading-[1.6] text-[#667085]">{description}</p>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={isProcessing}
            className="h-[40px] rounded-[10px] border border-[#D0D5DD] px-5 text-[14px] font-semibold text-[#344054]"
          >
            취소
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isProcessing}
            className="h-[40px] rounded-[10px] bg-[#DC2626] px-5 text-[14px] font-semibold text-white disabled:bg-[#FCA5A5]"
          >
            {isProcessing ? "처리 중" : "삭제"}
          </button>
        </div>
      </section>
    </div>
  );
}
