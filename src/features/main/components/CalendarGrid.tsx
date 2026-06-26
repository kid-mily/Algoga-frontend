import { CalendarGridProps } from "./Types";

const week_days = ["일", "월", "화", "수", "목", "금", "토"];

const day_color = [
  "text-red-400",
  "text-[#475569]",
  "text-[#475569]",
  "text-[#475569]",
  "text-[#475569]",
  "text-[#475569]",
  "text-blue-500",  
];

const SCHEDULE_COLOR: Record<string, string> = {
  LECTURE_START: "bg-[#FDD33B]",
  LECTURE_END: "bg-[#FDD33B]",
  TRIP: "bg-[#A8DCCF]",
  FLIGHT: "bg-[#60A5FA]",
};

const getScheduleColor = (type?: string) => {
  return type ? SCHEDULE_COLOR[type] ?? "bg-[#94A3B8]" : "bg-[#94A3B8]";
};

const formatDate = (year: number, month: number, date: number) => {
  return `${year}-${String(month).padStart(2, "0")}-${String(date).padStart(
    2,
    "0"
  )}`;
};

export default function CalendarGrid({
  year,
  month,
  schedules,
  selectedDate,
  onSelectDate,
}: CalendarGridProps) {
  const daysInMonth = new Date(year, month, 0).getDate();
  const firstDay = new Date(year, month - 1, 1).getDay();

  const dates = [
    ...Array.from({ length: firstDay }, () => null),
    ...Array.from({ length: daysInMonth }, (_, index) => index + 1),
  ];

  const scheduleMap = schedules.reduce<Record<string, typeof schedules>>(
    (acc, schedule) => {
      acc[schedule.eventDate] ??= [];
      acc[schedule.eventDate].push(schedule);
      return acc;
    },
    {}
  );

  return (
    <div className="p-2">
      <div className="mb-5 grid grid-cols-7 rounded-xl bg-[#F8FAFC] py-3">
        {week_days.map((day, index) => (
          <span
            key={day}
            className={`text-center text-sm font-bold ${day_color[index]}`}
          >
            {day}
          </span>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2">
        {dates.map((date, index) => {
          if (!date) {
            return <div key={`empty-${index}`} className="h-20" />;
          }

          const fullDate = formatDate(year, month, date);
          const daySchedules = scheduleMap[fullDate] ?? [];
          const dayIndex = index % 7;
          const isSelected = selectedDate === fullDate;

          return (
            <button
              key={fullDate}
              type="button"
              onClick={() => onSelectDate(fullDate)}
              aria-label={`${month}월 ${date}일 선택`}
              className={`flex h-20 flex-col rounded-xl border px-2 py-2 text-left transition ${
                isSelected
                  ? "border-[#439A97] bg-[#F0FDF9]"
                  : "border-transparent hover:border-[#D7E7E5] hover:bg-[#F7FBFA]"
              }`}
            >
              <time
                dateTime={fullDate}
                className={`text-sm font-semibold ${day_color[dayIndex]}`}
              >
                {date}
              </time>

              <div className="mt-1 flex flex-col gap-1">
                {daySchedules.slice(0, 2).map((schedule) => (
                  <span
                    key={`${schedule.scheduleId}-${schedule.title}`}
                    title={schedule.title}
                    className={`h-1.5 w-full rounded-full ${getScheduleColor(
                      schedule.type
                    )}`}
                  />
                ))}

                {daySchedules.length > 2 && (
                  <span className="text-[10px] font-semibold text-[#94A3B8]">
                    +{daySchedules.length - 2}
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}