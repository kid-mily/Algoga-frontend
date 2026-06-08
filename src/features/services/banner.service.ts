import { api } from '@/lib/api';
import { Banner } from '../main/components/types';

// 메인 페이지에서 배너 조회
export const getMainBanners = async (): Promise<Banner[]> => {
    try {
        const response = await api.get('/api/v1/banner');
        
        return response.data.data;
    } catch (error) {
        console.error('배너 데이터를 불러오는데 실패했습니다:', error);
        
        // 에러 발생 시 빈 배열을 반환하여 프론트엔드가 터지지 않도록 방어
        return []; 
    }
};