"use client";

import CalendarHeader from "./CalendarHeader";
import CalendarGrid from "./CalendarGrid";
import ScheduleSidebar from "./ScheduleSidebar";
import { useScheduleCalendar } from "../hooks/useScheduleCalendar";

export default function ScheduleCalendar() {
  const calendar = useScheduleCalendar();

  return (
    <section
      aria-labelledby="schedule-calendar-title"
      className="overflow-hidden rounded-2xl border border-[#E3E8F0] bg-white shadow-sm"
    >
      <CalendarHeader
        year={calendar.year}
        month={calendar.month}
        prevMonth={calendar.prevMonth}
        nextMonth={calendar.nextMonth}
      />

      <div className="grid grid-cols-[1fr_320px]">
        <CalendarGrid
          year={calendar.year}
          month={calendar.month}
          schedules={calendar.schedules}
          selectedDate={calendar.selectedDate}
          onSelectDate={calendar.setSelectedDate}
        />

        <ScheduleSidebar
          schedules={calendar.selectedSchedules}
          selectedDate={calendar.selectedDate}
          isLoggedIn={calendar.isLoggedIn}
          isAuthChecked={calendar.isAuthChecked}
          isLoading={calendar.isLoading}
          error={calendar.error}
        />
      </div>
    </section>
  );
}