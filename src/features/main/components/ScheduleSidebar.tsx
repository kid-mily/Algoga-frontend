import { ScheduleSidebarProps } from "./types";

export default function ScheduleSidebar({ schedules }: ScheduleSidebarProps) {

  if (!schedules) return null;

  return (
    <div className="bg-[#F8FAFC] p-8">
      <div className="mb-8 text-xl font-bold text-[#0A1628]">
        다가오는 일정
      </div>

      <div className="flex flex-col gap-5">
        {schedules.map((schedule, index) => (
          <div
            key={`${schedule.scheduleId}-${index}`}
            className="flex items-center justify-between rounded-3xl border border-[#EEF2F6] bg-white p-5"
          >
            <div className="flex items-start gap-3">
              <div
                className={`mt-2 h-3 w-3 rounded-full ${
                  schedule.type === 'TRAVEL'
                    ? 'bg-[#A8DCCF]'
                    : 'bg-[#F59E0B]'
                }`}
              />

              <div className="flex flex-col">
                <div className="font-bold text-[#0A1628]">
                  {schedule.title}
                </div>

                <div className="mt-1 text-sm text-[#94A3B8]">
                  {schedule.eventDate}
                </div>
              </div>
            </div>

            <div className="font-bold text-[#F59E0B]">
              {schedule.dDayText}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}