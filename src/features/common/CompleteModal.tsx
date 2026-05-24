// OneButtonModal.tsx
import React from "react";

interface CompleteModalProps {
  open: boolean;
  title?: string;
  description?: string;
  buttonText?: string;
  onConfirm: () => void;
}

export default function CompleteModal({
  open,
  title = "제목",
  description = "로그인에 성공하였습니다.",
  buttonText = "확인",
  onConfirm,
}: CompleteModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-[500px] overflow-hidden rounded-[20px] bg-white shadow-xl">
        
        {/* Header */}
        <div className="border-b border-[#D9DEE5] px-6 py-4">
          <h2 className="text-[32px] font-bold text-[#2F3640]">
            {title}
          </h2>
        </div>

        {/* Content */}
        <div className="flex flex-col items-center justify-center px-6 py-14">
          
          <p className="text-center text-[32px] text-[#8A94A6]">
            {description}
          </p>

          {/* Button */}
          <button
            onClick={onConfirm}
            className="mt-16 h-[48px] w-full rounded-[16px] bg-[#439A97] text-[18px] font-semibold text-white transition-colors duration-200 hover:bg-[#367c79]"
          >
            {buttonText}
          </button>
        </div>
      </div>
    </div>
  );
}