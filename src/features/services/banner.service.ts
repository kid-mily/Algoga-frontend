import { api, ApiResponse } from "@/lib/api";
import { Banner } from "../main/components/Types";


export const getMainBanners = async (): Promise<Banner[]> => {
  try {
    const response = await api.get<ApiResponse<Banner[]>>(
      "/api/v1/banner",
      {
      next: {revalidate: 1800 }, // ISR // 30분 마다 재생성
    }
    );

    return response.data;
  } catch (error) {
    console.error("배너 데이터를 불러오는데 실패했습니다:", error);
    return [];
  }
};