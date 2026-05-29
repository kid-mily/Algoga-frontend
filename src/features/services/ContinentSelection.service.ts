import { api } from "@/lib/api";
import { Continent } from "../classroom/types";

interface ContinentResponse {
    timestamp: string;
    status: number;
    code: string;
    message: string;
    data: Continent[];
}

// 데이터 불러오기
export const getContinents = async (): Promise<Continent[]> => {
    try {
        const response = await api.get<ContinentResponse>('/api/v1/maps/continents');
        return response.data.data;
    } catch (error) {
        console.error('대륙 데이터를 불러오는데 실패했습니다:', error);
        return []; // 에러 발생 시 빈 배열 반환
    }
};