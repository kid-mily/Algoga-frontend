import { api, ApiResponse } from "@/lib/api";
import { Schedule } from "../main/components/Types";

export const getMethodSchedules = async (
  year: number,
  month: number,
  signal?: AbortSignal
): Promise<Schedule[]> => {
  const response = await api.get<ApiResponse<{
      schedules: Schedule[];
    }>>("/api/v1/calendar", {
      params: { year, month },
      cache: "no-store",
      signal,
      suppressGlobalError: true,
  });

  return response.data.schedules ?? [];
};