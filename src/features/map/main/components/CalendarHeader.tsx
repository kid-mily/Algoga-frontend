interface CalendarHeaderProps {
  year: number
  month: number
  prevMonth: () => void
  nextMonth: () => void
}

export default function CalendarHeader({
  year,
  month,
  prevMonth,
  nextMonth,
}: CalendarHeaderProps) {
  return (
    <header className="flex items-center justify-between border-b border-[#EEF2F6] px-8 py-6">
      <h2 className="text-[28px] font-bold text-[#0A1628]">
        일정 캘린더
      </h2>

      <div className="flex items-center gap-6">
        <button
          onClick={prevMonth}
          className="text-2xl text-gray-400"
        >
          ‹
        </button>

        <span className="text-[24px] font-bold text-[#0A1628]">
          {year}년 {month}월
        </span>

        <button
          onClick={nextMonth}
          className="text-2xl text-gray-400"
        >
          ›
        </button>
      </div>
    </header>
  )
}