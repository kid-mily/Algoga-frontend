import { api, ApiResponse } from "@/lib/api";
import { Schedule } from "../main/components/Types";

// 일정은 최신 데이터가 필요하므로 캐시하지 않으며,
// API 요청 실패 시 화면이 중단되지 않도록 빈 배열을 반환한다.

export const getMethodSchedules = async (
  year: number,
  month: number,
  signal?: AbortSignal
): Promise<Schedule[]> => {
  try {
    const response = await api.get<
      ApiResponse<{
        schedules: Schedule[];
      }>
    >("/api/v1/calendar", {
      params: { year, month },
      cache: "no-store",
      signal,
    });

    return response.data.schedules;
  } catch (error) {
    console.error("일정 데이터를 불러오는데 실패했습니다:", error);
    return [];
  }
};