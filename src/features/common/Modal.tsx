
import React from "react";

interface ModalProps {
  open: boolean;
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function Modal({
  open,
  title = "제목",
  description = "정말 ~하시겠습니까?",
  confirmText = "확인",
  cancelText = "취소",
  onConfirm,
  onCancel,
}: ModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40">
      <div className="w-[450px] overflow-hidden rounded-[20px] bg-white shadow-xl">
       
        {/* Header */}
        <div className="border-b border-[#D9DEE5] px-6 py-4">
          <h2 className="text-[30px] font-bold text-[#2F3640]"
          >{title}
          </h2>
        </div>

        {/* Content */}
        <div className="flex flex-col items-center justify-center px-6 py-8">
          <p className="text-[25px] text-[#6B7280]">
            {description}
          </p>

          {/* Buttons */}
          <div className="mt-12 flex gap-4">
            <button
              onClick={onCancel}
              className="h-[48px] w-[180px] rounded-[16px] border border-[#D1D5DB] bg-white text-[18px] font-semibold text-[#4B5563] transition hover:bg-gray-50"
            >
              {cancelText}
            </button>

          <button
            onClick={onConfirm}
            className="h-[48px] w-[180px] rounded-[16px] bg-[#439A97] text-[18px] font-semibold text-white transition-colors duration-200 hover:bg-[#367c79]"
          >
            {confirmText}
          </button>
          </div>
        </div>
      </div>
    </div>
  );
}