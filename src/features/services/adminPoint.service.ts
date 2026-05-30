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
export const getStudentsPoints = async (): Promise<StudentPointInfo[]> => {
  try {
    const response = await adminApi.get(`/api/v1/admin/mileages`);
    
    // 🌟 핵심: 백엔드가 보내주는 data.users 구조를 정확히 짚어줍니다.
    const resData = response.data;
    const users = resData.data?.users || []; 

    return users.map((item: any) => ({
      userId: item.userId,
      userName: item.userName,
      email: item.email,
      totalPoint: item.totalMileage ?? 0, 
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