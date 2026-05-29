import { api } from "@/lib/api"
import { Schedule } from "../main/components/types";

export const getMethodSchedules = async (year: number, month: number): Promise<Schedule[]> => {
    try {
        const response = await api.get('/api/v1/calendar', {
            params: {year, month}
        });
        
        return response.data.data.schedules;
    } catch (error) {
        console.error('일정 데이터를 불러오는데 실패했습니다:', error);
        return []; // 에러 시 빈 배열 반환
    }
};
