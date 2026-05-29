import { api } from "@/lib/api";

export const getCountries = async (continentCode: string) => {
    try {
        const originUrl = '/api/v1/maps/continents/{continentCode}/countries';
        
        // 중괄호 부분을 넘겨받은 글자로 치환하기
        const targetUrl = originUrl.replace('{continentCode}', continentCode);
        
        // 요청 보내기
        const response = await api.get(targetUrl);
        return response.data.data;
    } catch (error) {
        console.error('나라 데이터를 불러오는데 실패했습니다:', error);
        return [];
    }
};