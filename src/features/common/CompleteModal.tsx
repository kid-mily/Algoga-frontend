// CompleteModal.tsx

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
  title = "알림",
  description = "로그인에 성공하였습니다.",
  buttonText = "확인",
  onConfirm,
}: CompleteModalProps) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40">
      <div className="w-[450px] overflow-hidden rounded-[20px] bg-white shadow-xl">
        {/* Header */}
        <div className="border-b border-[#D9DEE5] px-6 py-4">
          <h2 className="text-[30px] font-bold text-[#2F3640]">
            {title}
          </h2>
        </div>

       {/* Content */}
        <div className="flex flex-col items-center justify-center px-6 py-10">

          <p className="text-[22px] text-[#6B7280]">
            {description}
          </p>

          {/* Button */}
          <div className="mt-12">

            <button
              onClick={onConfirm}
              className="h-[48px] w-[180px] rounded-[16px] bg-[#439A97] text-[18px] font-semibold text-white transition-colors duration-200 hover:bg-[#367c79]"
            >
              {buttonText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}