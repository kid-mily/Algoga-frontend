import { api, ApiResponse } from "@/lib/api";
import { Notice } from "../main/components/Types";

export const getMainNotices = async () => {
  const response = await api.get<ApiResponse<Notice[]>>(
    "/api/v1/public/notices/main",
    {
      next: {revalidate: 1800 }, // ISR // 30분 마다 재생성
    }
  );

  return response.data;
};