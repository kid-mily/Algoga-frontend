import { ScheduleSidebarProps } from "./Types";

const SCHEDULE_COLOR: Record<string, string> = {
  LECTURE_START: "bg-[#FDD33B]",
  LECTURE_END: "bg-[#FDD33B]",
  TRIP: "bg-[#A8DCCF]",
  FLIGHT: "bg-[#60A5FA]",
  HOTEL: "bg-[#E57A36]",
};

const getScheduleColor = (type?: string) => {
  return type ? SCHEDULE_COLOR[type] ?? "bg-[#94A3B8]" : "bg-[#94A3B8]";
};

export default function ScheduleSidebar({
  schedules,
  selectedDate,
}: ScheduleSidebarProps) {
  return (
    <aside className="border-l border-[#EEF2F6] bg-[#F8FAFC] p-6">
      <header className="mb-6">
        <h3 className="text-xl font-semibold text-[#0A1628]">{selectedDate} 일정</h3>
      </header>

      {schedules.length === 0 ? (
        <p className="py-6 text-center text-sm text-[#94A3B8]">
          선택한 날짜에 등록된 일정이 없습니다.
        </p>
      ) : (
        <ul className="flex max-h-[500px] flex-col gap-3 overflow-y-auto">
          {schedules.map((schedule) => (
            <li
              key={`${schedule.scheduleId}-${schedule.eventDate}-${schedule.title}`}
              className="relative rounded-xl border border-[#EEF2F6] bg-white p-4 pl-5 shadow-sm"
            >
              <span
                className={`absolute left-0 top-0 h-full w-1 rounded-l-xl ${getScheduleColor(
                  schedule.type
                )}`}
              />

              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-bold text-[#0A1628]">{schedule.title}</p>

                  <time
                    dateTime={schedule.eventDate}
                    className="mt-1 block text-sm text-[#94A3B8]"
                  >
                    {schedule.eventDate}
                  </time>
                </div>

                <span className="shrink-0 rounded-full bg-[#FFF7ED] px-3 py-1 text-xs font-bold text-[#F59E0B]">
                  {schedule.dDayText}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </aside>
  );
}