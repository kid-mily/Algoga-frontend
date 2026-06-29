"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ApiRequestError } from "@/lib/api";
import { getMethodSchedules } from "@/features/services/schedule.service";
import { getMe } from "@/features/services/user.service";
import { formatCalendarDate, getMonthStartDate } from "../utils/calendar.utils";
import type { Schedule } from "../types";

export function useScheduleCalendar() {
  const today = new Date();

  const [currentDate, setCurrentDate] = useState(() =>
    getMonthStartDate(today)
  );
  const [selectedDate, setSelectedDate] = useState(() =>
    formatCalendarDate(today.getFullYear(), today.getMonth() + 1, today.getDate())
  );
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [authVersion, setAuthVersion] = useState(0);

  const activeControllerRef = useRef<AbortController | null>(null);
  const latestRequestIdRef = useRef(0);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1;

  const selectedSchedules = useMemo(() => {
    return schedules.filter((schedule) => schedule.eventDate === selectedDate);
  }, [schedules, selectedDate]);

  const moveMonth = (offset: number) => {
    setCurrentDate((prev) => {
      const nextDate = new Date(prev.getFullYear(), prev.getMonth() + offset, 1);

      setSelectedDate(
        formatCalendarDate(nextDate.getFullYear(), nextDate.getMonth() + 1, 1)
      );

      return nextDate;
    });
  };

  useEffect(() => {
    const handleAuthStateChanged = (event: Event) => {
      const authEvent = event as CustomEvent<{ isLoggedIn?: boolean }>;
      const nextIsLoggedIn = authEvent.detail?.isLoggedIn;

      activeControllerRef.current?.abort();
      activeControllerRef.current = null;
      latestRequestIdRef.current += 1;

      setSchedules([]);
      setError(null);
      setIsLoading(false);

      if (nextIsLoggedIn === false) {
        setIsLoggedIn(false);
        setIsAuthChecked(true);
        return;
      }

      setIsAuthChecked(false);
      setAuthVersion((prev) => prev + 1);
    };

    window.addEventListener("auth-state-changed", handleAuthStateChanged);

    return () => {
      activeControllerRef.current?.abort();
      activeControllerRef.current = null;
      window.removeEventListener("auth-state-changed", handleAuthStateChanged);
    };
  }, []);

  useEffect(() => {
    activeControllerRef.current?.abort();

    const controller = new AbortController();
    const requestId = latestRequestIdRef.current + 1;

    activeControllerRef.current = controller;
    latestRequestIdRef.current = requestId;

    const isCurrentRequest = () => {
      return !controller.signal.aborted && latestRequestIdRef.current === requestId;
    };

    const fetchSchedules = async () => {
      try {
        setIsLoading(true);
        setError(null);
        setIsAuthChecked(false);

        const currentUser = await getMe(controller.signal);

        if (!isCurrentRequest()) return;

        if (!currentUser || !currentUser.userId) {
          setSchedules([]);
          setIsLoggedIn(false);
          setError(null);
          return;
        }

        const data = await getMethodSchedules(year, month, controller.signal);

        if (!isCurrentRequest()) return;

        setSchedules(data);
        setIsLoggedIn(true);
      } catch (error) {
        if (!isCurrentRequest()) return;

        if (
          error instanceof ApiRequestError &&
          (error.status === 401 || error.status === 403)
        ) {
          setSchedules([]);
          setIsLoggedIn(false);
          setError(null);
          return;
        }

        console.error("[calendar] 일정 조회 실패:", error);
        setSchedules([]);
        setIsLoggedIn(false);
        setError(null);
      } finally {
        if (isCurrentRequest()) {
          setIsAuthChecked(true);
          setIsLoading(false);
        }

        if (activeControllerRef.current === controller) {
          activeControllerRef.current = null;
        }
      }
    };

    void fetchSchedules();

    return () => {
      controller.abort();

      if (activeControllerRef.current === controller) {
        activeControllerRef.current = null;
      }
    };
  }, [year, month, authVersion]);

  return {
    year,
    month,
    selectedDate,
    selectedSchedules: isLoggedIn ? selectedSchedules : [],
    schedules: isLoggedIn ? schedules : [],
    isLoading,
    isLoggedIn,
    isAuthChecked,
    error,
    setSelectedDate,
    prevMonth: () => moveMonth(-1),
    nextMonth: () => moveMonth(1),
  };
}
