import { api } from "@/lib/api";

// 특정 나라의 강의 목록을 불러오는 함수
export const getCourse = async (countryCode: string) => {
    const endpoint = '/api/v1/courses/countries/{countryId}';
    const realUrl = endpoint.replace("{countryId}", countryCode);
    const response = await api.get(realUrl); 
    
    return response.data;
};