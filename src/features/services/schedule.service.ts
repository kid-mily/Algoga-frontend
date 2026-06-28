import { api, ApiResponse } from "@/lib/api";
import type { Schedule } from "@/features/main/calendar/types";

type ScheduleResponse = {
  schedules?: Schedule[];
};

export const getMethodSchedules = async (
  year: number,
  month: number,
  signal?: AbortSignal
): Promise<Schedule[]> => {
  const response = await api.get<ApiResponse<ScheduleResponse>>("/api/v1/calendar", {
    params: { year, month },
    cache: "no-store",
    signal,
    suppressGlobalError: true,
  });

  return Array.isArray(response.data?.schedules) ? response.data.schedules : [];
};