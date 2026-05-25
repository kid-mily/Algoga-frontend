interface CalendarGridProps {
  year: number
  month: number
  schedules: {
    id: number
    title: string
    date: string
    type: string
  }[]
}

export default function CalendarGrid({
  year,
  month,
  schedules,
}: CalendarGridProps) {
  const daysInMonth = new Date(
    year,
    month,
    0
  ).getDate()

  const dates = Array.from(
    { length: daysInMonth },
    (_, i) => i + 1
  )

  return (
    <div className="p-8">
      {/* 요일 */}
      <div className="mb-10 grid grid-cols-7">
        {[
          '일',
          '월',
          '화',
          '수',
          '목',
          '금',
          '토',
        ].map((day, index) => (
          <span
            key={day}
            className={`text-center text-[18px] font-semibold ${
              index === 0
                ? 'text-red-400'
                : index === 6
                ? 'text-[#6FA7A6]'
                : 'text-[#94A3B8]'
            }`}
          >
            {day}
          </span>
        ))}
      </div>

      {/* 날짜 */}
      <div className="grid grid-cols-7 gap-y-10">
        {dates.map((date) => {
          const fullDate = `${year}-${String(
            month
          ).padStart(2, '0')}-${String(
            date
          ).padStart(2, '0')}`

          const schedule = schedules.find(
            (schedule) =>
              schedule.date === fullDate
          )

          const day = new Date(
            year,
            month - 1,
            date
          ).getDay()

          return (
            <div
              key={date}
              className="relative flex h-[110px] flex-col items-center"
            >
              <span
                className={`text-[20px] font-medium ${
                  day === 0
                    ? 'text-red-400'
                    : day === 6
                    ? 'text-[#6FA7A6]'
                    : 'text-[#475569]'
                }`}
              >
                {date}
              </span>

              {schedule && (
                <div
                  className={`absolute top-10 h-3 w-20 rounded-full ${
                    schedule.type ===
                    'TRAVEL'
                      ? 'bg-[#A8DCCF]'
                      : 'bg-[#F59E0B]'
                  }`}
                />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}