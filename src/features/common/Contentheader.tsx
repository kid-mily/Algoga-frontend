"use client";

interface ContentHeaderProps {
  hasNotification?: boolean;
}

export default function ContentHeader({
  hasNotification = true,
}: ContentHeaderProps) {
  return (
    <header className="flex h-[77px] items-center justify-between border-b border-[#E4E7EC] bg-white px-8">

      {/* 제목 */}
      <h1 className="text-[22px] font-semibold text-[#111827]">
        관리자 페이지
      </h1>

      {/* 알림 */}
      <button className="relative">

        {/* 아이콘 */}
        <img
          src="/images/alarm.svg"
          alt="알람"
          className="h-[40px] w-[40px]"
        />

        {/* 알림 존재 시 빨간 점 */}
        {hasNotification && (
          <span className="absolute right-0 top-0 h-[8px] w-[8px] rounded-full bg-red-500" />
        )}
      </button>
    </header>
  );
}