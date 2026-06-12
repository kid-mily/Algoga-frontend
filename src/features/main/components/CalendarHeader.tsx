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
    <header className="flex items-center justify-between border-b border-[#EEF2F6] bg-white px-8 py-6">
      <div>
        <h2
          className="mt-1 text-2xl font-bold text-[#0A1628]"
        >
          일정 캘린더
        </h2>
      </div>

      <nav aria-label="월 이동" className="flex items-center gap-4">
        <button
          type="button"
          onClick={prevMonth}
          aria-label="이전 달 보기"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-[#E3E8F0] text-lg font-bold text-[#64748B] transition hover:border-[#439A97] hover:text-[#439A97]"
        >
          {"<"}
        </button>

        <time
          dateTime={`${year}-${String(month).padStart(2, "0")}`}
          className="min-w-32 text-center text-xl font-bold text-[#0A1628]"
        >
          {year}년 {month}월
        </time>

        <button
          type="button"
          onClick={nextMonth}
          aria-label="다음 달 보기"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-[#E3E8F0] text-lg font-bold text-[#64748B] transition hover:border-[#439A97] hover:text-[#439A97]"
        >
          {">"}
        </button>
      </nav>
    </header>
  );
}