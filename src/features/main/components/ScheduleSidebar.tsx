import { Schedule } from "./Types"

interface ScheduleSidebarProps {
  schedules: Schedule[]
}

export default function ScheduleSidebar({schedules}: ScheduleSidebarProps) {
  return (
    <aside className="bg-[#F8FAFC] p-8">
      <h3 className="mb-8 text-xl font-bold text-[#0A1628]">
        다가오는 일정
      </h3>

      <div className="flex flex-col gap-5">
        {schedules.map((schedule) => (
          <article
            key={schedule.scheduleId}
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
                <p className="font-bold text-[#0A1628]">
                  {schedule.title}
                </p>

                <span className="mt-1 text-sm text-[#94A3B8]">
                  {schedule.eventDate}
                </span>
              </div>
            </div>

            <span className="font-bold text-[#F59E0B]">
              {schedule.dDayText}
            </span>
          </article>
        ))}
      </div>
    </aside>
  )
}