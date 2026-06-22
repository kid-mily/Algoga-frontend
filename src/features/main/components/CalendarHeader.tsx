"use client";

interface CalendarHeaderProps {
  year: number;
  month: number;
  prevMonth: () => void;
  nextMonth: () => void;
}

export default function CalendarHeader({
  year,
  month,
  prevMonth,
  nextMonth,
}: CalendarHeaderProps) {
  return (
    <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#E8EEF3] bg-white px-5 py-4">
      <div className="flex items-center gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#EAF5F4] text-lg">
          🗓️
        </span>

        <div>
          <h2 className="text-base font-bold text-[#0A1628]">
            여행 학습 캘린더
          </h2>
          <p className="mt-0.5 text-xs text-[#8A94A6]">
            강의와 여행 일정을 확인하세요.
          </p>
        </div>
      </div>

      {/* 월 이동 */}
      <nav aria-label="월 이동" className="flex items-center justify-center gap-4">
        <button
          type="button"
          onClick={prevMonth}
          aria-label="이전 달 보기"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-[#E3E8F0] text-sm font-bold text-[#64748B] transition hover:border-[#439A97] hover:text-[#439A97]"
        >
          &lt;
        </button>

        <time
          dateTime={`${year}-${String(month).padStart(2, "0")}`}
          className="min-w-28 text-center text-base font-bold text-[#0A1628]"
        >
          {year}년 {month}월
        </time>

        <button
          type="button"
          onClick={nextMonth}
          aria-label="다음 달 보기"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-[#E3E8F0] text-sm font-bold text-[#64748B] transition hover:border-[#439A97] hover:text-[#439A97]"
        >
          &gt;
        </button>
      </nav>
    </header>
  );
}