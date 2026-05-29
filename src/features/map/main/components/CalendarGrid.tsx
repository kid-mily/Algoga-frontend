import { Schedule } from "./Types"

interface CalendarGridProps {
  year: number
  month: number
  schedules: Schedule[]
}

export default function CalendarGrid({
  year,
  month,
  schedules,
}: CalendarGridProps) {
  // 현재 달 마지막 날짜
  // month에 그대로 값을 넣고 일자(day)에 0을 넣으면 '이전 달의 마지막 날'이 나와서, 이번 달의 총 일수가 됨
  const daysInMonth = new Date(year, month, 0).getDate()

  // 현재 달 시작 요일
  // month에 그대로 값을 넣고 일자(day)에 0을 넣으면 '이전 달의 마지막 날'이 나와서, 이번 달의 총 일수가 됨
  const firstDay = new Date(year, month - 1, 1).getDay()

  // 앞 빈칸 (달력 시작 전 빈칸 채우기)
  const emptyDates = Array.from({ length: firstDay }, () => null)

  // 날짜 배열
  const dates = [
    ...emptyDates,
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]

  return (
    <div className="p-8">
      {/* 요일 */}
      <div className="mb-10 grid grid-cols-7">
        {['일', '월', '화', '수', '목', '금', '토'].map((day, index) => (
          <span
            key={day}
            className={`text-center text-[18px] font-semibold ${
              index === 0
                ? 'text-red-400'    // 일요일은 빨간색
                : index === 6
                ? 'text-[#6FA7A6]'    // 토요일은 민트 계열
                : 'text-[#94A3B8]'    // 평일은 회색
            }`}
          >
            {day}
          </span>
        ))}
      </div>

      {/* 날짜 */}
      <div className="grid grid-cols-7 gap-y-10">
        {dates.map((date, index) => {
          // 빈칸
          if (date === null) {
            return <div key={`empty-${index}`} />
          }

          // 날짜 문자열
          // 비교를 위해 현재 날짜를 'YYYY-MM-DD' 포맷의 문자열로 만든다.
          // padStart(2, '0')는 9월을 '09'로, 5일을 '05'로 맞춰주는 역할을 함.
          const fullDate = `${year}-${String(month).padStart(2, '0')}-${String(date).padStart(2, '0')}`

          // 해당 날짜 일정
          const schedule = schedules.find((s) => s.eventDate === fullDate)

          // 요일 계산
          const day = index % 7

          return (
            <div
              key={date}
              className="relative flex h-[110px] flex-col items-center"
            >
              {/* 날짜 */}
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

              {/* 일정 표시 */}
              {schedule && (
                <div
                  className={`absolute top-10 h-3 w-20 rounded-full ${
                    schedule.type === 'TRIP' 
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