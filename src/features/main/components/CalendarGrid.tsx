import { CalendarGridProps } from "./types"

// 요일 배열 (리렌더링될 때마다 다시 생성되지 않도록 컴포넌트 외부에 선언)
const week = ['일', '월', '화', '수', '목', '금', '토']

// 요일별 텍스트 색상을 반환하는 함수
const getDayColor = (dayIndex: number, defaultColor: string) => {
  if (dayIndex === 0) return 'text-red-400'       // 일요일
  if (dayIndex === 6) return 'text-blue-600'     // 토요일
  return defaultColor                             // 평일
}

export default function CalendarGrid({
  year,
  month,
  schedules,
}: CalendarGridProps) {
  // Date 객체에서 day(일) 자리에 0을 넣으면 이전 달의 마지막 날을 반환하므로, 이번 달 총 일수를 구할 수 있음
  const daysInMonth = new Date(year, month, 0).getDate()
  // 달 1일의 요일 인덱스 구하기 (0: 일요일 ~6: 토요일)
  const firstDay = new Date(year, month - 1, 1).getDay()

  // 달력 배열 생성
  // 1일이 시작하기 전까지의 빈칸을 null로 채운 배열
  const emptyDates = Array.from({ length: firstDay }, () => null)
  const dates = [
    ...emptyDates,
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]

  const scheduleMap = new Map(schedules.map((s) => [s.eventDate, s]))

  // 날짜 ('YYYY-MM-DD')
  const formatToFullDate = (date: number) => {
    return `${year}-${String(month).padStart(2, '0')}-${String(date).padStart(2, '0')}`
  }

  return (
    <div className="p-8">
      {/* --- 요일 --- */}
      <div className="mb-10 grid grid-cols-7">
        {week.map((day, index) => (
          <span
            key={day}
            className={`text-center text-lg font-semibold ${getDayColor(index, 'text-[#94A3B8]')}`}
          >
            {day}
          </span>
        ))}
      </div>

      {/* --- 달력 날짜 및 일정 --- */}
      <div className="grid grid-cols-7 gap-y-10">
        {dates.map((date, index) => {
          // 1일 이전의 빈칸 처리
          if (date === null) {
            return <div key={`empty-${index}`} />
          }

          const fullDate = formatToFullDate(date)
          const schedule = scheduleMap.get(fullDate)  // 현재 날짜에 해당하는 일정 조회
          const dayIndex = index % 7    // 현재 칸의 요일 인덱스 (0~6)

          return (
            <div
              key={date}
              className="relative flex h-16 flex-col items-center"
            >
              {/* 날짜 */}
              <span
                className={`text-lg font-medium ${getDayColor(dayIndex, 'text-[#475569]')}`}
              >
                {date}
              </span>

              {/* 일정이 있응ㄹ 경우 색상 막대 표시 */}
              {schedule && (
                <div
                  className={`absolute top-10 h-3 w-20 rounded-full ${
                    schedule.type === 'TRIP'
                      ? 'bg-[#A8DCCF]'  // 여행 일정
                      : 'bg-[#F59E0B]'  // 그 외 일정
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