import { api, ApiResponse } from "@/lib/api";
import { Notice } from "../main/components/Types";

export const getMainNotices = async () => {
  const response = await api.get<ApiResponse<Notice[]>>(
    "/api/v1/public/notices/main"
  );

  return response.data;
};