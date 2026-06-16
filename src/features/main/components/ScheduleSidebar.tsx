import Link from "next/link";
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

const formatDisplayDate = (dateStr: string) => {
  const [, month, day] = dateStr.split("-").map(Number);
  return `${month}월 ${day}일`;
};

export default function ScheduleSidebar({
  schedules,
  selectedDate,
  isLoggedIn = true,
  isAuthChecked = true,
  isLoading = false,
  error = null,
}: ScheduleSidebarProps) {
  return (
    <aside className="border-l border-[#EEF2F6] bg-[#F8FAFC] p-6">
      <header className="mb-6">
        <h3 className="text-xl font-semibold text-[#0A1628]">
          {formatDisplayDate(selectedDate)} 일정
        </h3>
      </header>

      {!isAuthChecked ? (
        <p className="py-6 text-center text-sm text-[#94A3B8]">
          로그인 상태를 확인하는 중입니다.
        </p>
      ) : !isLoggedIn ? (
        <div className="text-center">
          <p className="font-semibold text-[#0A1628]">
            로그인 후 일정을 확인할 수 있습니다.
          </p>

          <p className="mt-2 text-sm leading-6 text-[#64748B]">
            강의 신청 내역과 여행 구매 내역이 선택한 날짜별로 표시됩니다.
          </p>

          <Link
            href="/auth/login"
            className="mt-4 inline-flex rounded-xl bg-[#439A97] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#357f7c]"
          >
            로그인하기
          </Link>
        </div>
      ) : isLoading ? (
        <p className="py-6 text-center text-sm text-[#94A3B8]">
          일정을 불러오는 중입니다.
        </p>
      ) : error ? (
        <p className="py-6 text-center text-sm text-red-500">{error}</p>
      ) : schedules.length === 0 ? (
        <p className="py-6 text-center text-sm text-[#94A3B8]">
          선택한 날짜에 등록된 일정이 없습니다.
        </p>
      ) : (
        <ul className="flex max-h-[500px] flex-col gap-3 overflow-y-auto">
          {schedules.map((schedule) => (
            <li
              key={schedule.scheduleId}
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