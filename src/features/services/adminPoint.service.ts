import axios from "axios";
import { adminApi } from "@/lib/api";

export interface PointHistory {
  pointId?: number;
  mileageId?: number; 
  userId: number;
  amount: number;
  type?: string; 
  reason: string;
  createdAt: string;
}

export interface StudentPointInfo {
  userId: number;
  userName: string;
  email: string;
  totalPoint: number;
}

export interface PointPayload {
  userId: number;
  amount: number;
  reason: string;
}

// ------------------------------------------
// 공통 에러 핸들러
// ------------------------------------------
const getErrorMessage = (error: unknown, fallbackMessage: string) => {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message || fallbackMessage;
  }
  if (error instanceof Error) {
    return error.message || fallbackMessage;
  }
  return fallbackMessage;
};

// ------------------------------------------
// 1. 수강생 및 보유 마일리지 목록 조회 (GET)
// ------------------------------------------
// 1. 수강생 및 보유 마일리지 목록 조회 (GET)
export const getStudentsPoints = async (): Promise<StudentPointInfo[]> => {
  try {
    const response = await adminApi.get(`/api/v1/admin/mileages`);
    
    // 🌟 디버깅용: 백엔드가 정확히 어떤 구조로 응답하는지 확인 (F12 네트워크 탭과 비교)
    console.log("🚀 백엔드 마일리지 응답 원본:", response.data);

    // 응답 형태가 { data: { users: [...] } } 인지, 아니면 그냥 [ ... ] 인지 확인이 필요합니다.
    // 백엔드 응답이 바로 배열이라면 response.data 자체가 리스트일 수 있습니다.
    const resData = response.data;
    
    // 데이터를 유연하게 추출하는 로직
    // 1) resData.data.users 가 있는 경우
    // 2) resData.users 가 있는 경우
    // 3) resData 자체가 배열인 경우
    const users = resData.data?.users || resData.users || (Array.isArray(resData) ? resData : []);

    if (users.length === 0) {
      console.warn("⚠️ 마일리지 목록이 비어있거나 응답 구조가 다릅니다.");
    }

    return users.map((item: any) => ({
      userId: item.userId,
      userName: item.userName,
      email: item.email,
      // 🌟 필드명 정확히 확인! item.totalMileage인지 item.mileage인지 확인하세요.
      totalPoint: item.totalMileage ?? item.mileage ?? 0, 
    }));
  } catch (error: any) {
    throw new Error(getErrorMessage(error, "수강생 목록 조회 실패"));
  }
};

// ------------------------------------------
// 2. 마일리지 지급 (POST) - Earn
// ------------------------------------------
export const givePoints = async (payload: PointPayload) => {
  try {
    const { userId, ...restPayload } = payload;
    const response = await adminApi.post(`/api/v1/admin/mileages/users/${userId}/earn`, restPayload);
    return response.data?.data || response.data || response;
  } catch (error: any) {
    console.error(`🔥 마일리지 지급 에러:`, error);
    throw new Error(getErrorMessage(error, "마일리지 지급에 실패했습니다."));
  }
};

// ------------------------------------------
// 3. 마일리지 회수/사용 (POST) - Use
// ------------------------------------------
export const recallPoints = async (payload: PointPayload) => {
  try {
    const { userId, ...restPayload } = payload;
    const response = await adminApi.post(`/api/v1/admin/mileages/users/${userId}/use`, restPayload);
    return response.data?.data || response.data || response;
  } catch (error: any) {
    console.error(`🔥 마일리지 회수 에러:`, error);
    throw new Error(getErrorMessage(error, "마일리지 회수에 실패했습니다."));
  }
};

// ------------------------------------------
// 4. 특정 수강생의 마일리지 내역 상세 조회 (GET) - Histories
// ------------------------------------------
export const getPointHistory = async (userId: number): Promise<PointHistory[]> => {
  try {
    const response = await adminApi.get(`/api/v1/admin/mileages/users/${userId}/histories`, {
      params: { t: new Date().getTime() },
    });
    
    const resData = response.data || response;
    const dataList = resData.data || resData.content || resData;

    let list = [];
    if (Array.isArray(dataList)) list = dataList;
    else if (Array.isArray(dataList?.content)) list = dataList.content;
    
    return list;
  } catch (error: any) {
    console.error(`🔥 마일리지 내역 조회 에러:`, error);
    throw new Error(getErrorMessage(error, "마일리지 내역 조회에 실패했습니다."));
  }
};