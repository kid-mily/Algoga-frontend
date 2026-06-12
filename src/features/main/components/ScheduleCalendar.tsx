"use client";

import { useEffect, useMemo, useState } from "react";
import CalendarHeader from "./CalendarHeader";
import CalendarGrid from "./CalendarGrid";
import ScheduleSidebar from "./ScheduleSidebar";
import { Schedule } from "./Types";
import { getMethodSchedules } from "@/features/services/schedule.service";

interface ScheduleCalendarProps {
  initialYear: number;
  initialMonth: number;
  initialSchedules: Schedule[];
}

const formatDate = (year: number, month: number, date: number) => {
  return `${year}-${String(month).padStart(2, "0")}-${String(date).padStart(
    2,
    "0"
  )}`;
};

export default function ScheduleCalendar({
  initialYear,
  initialMonth,
  initialSchedules,
}: ScheduleCalendarProps) {
  const [currentDate, setCurrentDate] = useState(
    new Date(initialYear, initialMonth - 1, 1)
  );
  const [schedules, setSchedules] = useState<Schedule[]>(initialSchedules);
  const [isLoading, setIsLoading] = useState(false);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1;

  const [selectedDate, setSelectedDate] = useState(
    formatDate(year, month, new Date().getDate())
  );

  const selectedSchedules = useMemo(() => {
    return schedules.filter((schedule) => schedule.eventDate === selectedDate);
  }, [schedules, selectedDate]);

  const prevMonth = () => {
    const nextDate = new Date(year, currentDate.getMonth() - 1, 1);
    setCurrentDate(nextDate);
    setSelectedDate(formatDate(nextDate.getFullYear(), nextDate.getMonth() + 1, 1));
  };

  const nextMonth = () => {
    const nextDate = new Date(year, currentDate.getMonth() + 1, 1);
    setCurrentDate(nextDate);
    setSelectedDate(formatDate(nextDate.getFullYear(), nextDate.getMonth() + 1, 1));
  };

  useEffect(() => {
    let isMounted = true;

    const fetchSchedules = async () => {
      try {
        setIsLoading(true);

        const data = await getMethodSchedules(year, month);

        if (isMounted) {
          setSchedules(data);
        }
      } catch (error) {
        console.error("일정 데이터를 불러오지 못했습니다.", error);

        if (isMounted) {
          setSchedules([]);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchSchedules();

    return () => {
      isMounted = false;
    };
  }, [year, month]);

  return (
    <section
      aria-labelledby="schedule-calendar-title"
      className="overflow-hidden rounded-2xl border border-[#E3E8F0] bg-white shadow-sm"
    >
      <CalendarHeader
        year={year}
        month={month}
        prevMonth={prevMonth}
        nextMonth={nextMonth}
      />

      {isLoading && (
        <div className="border-b border-[#EEF2F6] bg-[#F8FAFC] px-8 py-2 text-sm font-medium text-[#64748B]">
          일정을 불러오는 중입니다.
        </div>
      )}

      <div className="grid grid-cols-[1fr_320px]">
        <CalendarGrid
          year={year}
          month={month}
          schedules={schedules}
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
        />

        <ScheduleSidebar
          schedules={selectedSchedules}
          selectedDate={selectedDate}
        />
      </div>
    </section>
  );
}