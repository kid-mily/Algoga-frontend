"use client";

import { useEffect, useMemo, useState } from "react";
import CalendarHeader from "./CalendarHeader";
import CalendarGrid from "./CalendarGrid";
import ScheduleSidebar from "./ScheduleSidebar";
import { Schedule } from "./Types";
import { getMethodSchedules } from "@/features/services/schedule.service";
import { ApiRequestError } from "@/lib/api";

const formatDate = (year: number, month: number, date: number) => {
  return `${year}-${String(month).padStart(2, "0")}-${String(date).padStart(
    2,
    "0"
  )}`;
};

export default function ScheduleCalendar() {
  const today = new Date();

  const [currentDate, setCurrentDate] = useState(
    () => new Date(today.getFullYear(), today.getMonth(), 1)
  );

  const [selectedDate, setSelectedDate] = useState(() =>
    formatDate(today.getFullYear(), today.getMonth() + 1, today.getDate())
  );

  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAuthChecked, setIsAuthChecked] = useState(false);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1;

  const selectedSchedules = useMemo(() => {
    return schedules.filter((schedule) => schedule.eventDate === selectedDate);
  }, [schedules, selectedDate]);

  const prevMonth = () => {
    setCurrentDate((prev) => {
      const nextDate = new Date(prev.getFullYear(), prev.getMonth() - 1, 1);

      setSelectedDate(
        formatDate(nextDate.getFullYear(), nextDate.getMonth() + 1, 1)
      );

      return nextDate;
    });
  };

  const nextMonth = () => {
    setCurrentDate((prev) => {
      const nextDate = new Date(prev.getFullYear(), prev.getMonth() + 1, 1);

      setSelectedDate(
        formatDate(nextDate.getFullYear(), nextDate.getMonth() + 1, 1)
      );

      return nextDate;
    });
  };

  useEffect(() => {
    const controller = new AbortController();

    const fetchSchedules = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const data = await getMethodSchedules(year, month, controller.signal);

        setSchedules(data);
        setIsLoggedIn(true);
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") return;

        if (
          error instanceof ApiRequestError &&
          (error.status === 401 || error.status === 403)
        ) {
          setSchedules([]);
          setIsLoggedIn(false);
          setError(null);
          return;
        }

        console.error("일정 데이터를 불러오지 못했습니다:", error);

        setSchedules([]);
        setIsLoggedIn(true);
        setError("일정을 불러올 수 없습니다.");
      } finally {
        setIsAuthChecked(true);
        setIsLoading(false);
      }
    };

    void fetchSchedules();

    return () => {
      controller.abort();
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

      <div className="grid grid-cols-[1fr_320px]">
        <CalendarGrid
          year={year}
          month={month}
          schedules={isLoggedIn ? schedules : []}
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
        />

        <ScheduleSidebar
          schedules={selectedSchedules}
          selectedDate={selectedDate}
          isLoggedIn={isLoggedIn}
          isAuthChecked={isAuthChecked}
          isLoading={isLoading}
          error={error}
        />
      </div>
    </section>
  );
}