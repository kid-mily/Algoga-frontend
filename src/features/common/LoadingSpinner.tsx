"use client";

interface LoadingSpinnerProps {
  text?: string; // 원하는 로딩 텍스트로 바꿀 수 있도록 옵션 부여
}

export default function LoadingSpinner({ text = "데이터를 불러오는 중입니다..." }: LoadingSpinnerProps) {
  return (
    <div className="flex w-full flex-col items-center justify-center py-16">
    {/* 스피너 */}
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#E4E7EC] border-t-[#439A97]"></div>
      {/* 로딩 안내 텍스트 */}
      <p className="mt-4 text-[14px] font-medium text-[#667085]">
        {text}
      </p>
    </div>
  );
}