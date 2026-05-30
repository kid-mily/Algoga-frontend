import { api } from "@/lib/api";

export const getCountries = async (continentCode: string) => {
    try {
        const response = await api.get(`/api/v1/maps/continents/${continentCode}/countries`);
        
        // 안전하게 데이터만 반환 (혹시 데이터가 없으면 빈 배열 반환)
        return response.data?.data || [];
    } catch (error) {
        console.error('나라 데이터를 불러오는데 실패했습니다:', error);
        return [];
    }
};