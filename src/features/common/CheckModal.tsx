// CheckModal.tsx

import React from "react";

interface CheckModalProps {
  open: boolean;

  title?: string;

  description?: string;

  buttonText?: string;

  onConfirm: () => void;
}

export default function CheckModal({
  open,

  title = "완료되었습니다",

  description = "작업이 완료되었습니다.",

  buttonText = "확인",

  onConfirm,
}: CheckModalProps) {

  if (!open) {

    return null;
  }

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40">

      {/* Modal */}
      <div className="w-[450px] overflow-hidden rounded-[20px] bg-white shadow-xl">

        <div className="flex flex-col items-center justify-center px-6 py-7">

          {/* Icon */}
          <div className="flex h-[80px] w-[80px] items-center justify-center rounded-full bg-[#439A97]">

            <img
              src="/images/check.svg"
              alt="check"
              className="h-[30px] w-[30px]"
            />
          </div>

          {/* Text */}
          <div className="mt-5 text-center">

            <h2 className="text-[24px] font-bold text-[#2F3640]">

              {title}
            </h2>

            <p className="mt-2 text-[18px] text-[#8A94A6]">

              {description}
            </p>
          </div>

          {/* Button */}
          <button
            onClick={onConfirm}
            className="mt-7 h-[48px] w-[250px] rounded-[16px] bg-[#439A97] text-[18px] font-semibold text-white transition-colors duration-200 hover:bg-[#367c79]"
          >
            {buttonText}
          </button>
        </div>
      </div>
    </div>
  );
}