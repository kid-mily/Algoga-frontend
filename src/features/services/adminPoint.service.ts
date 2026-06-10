import { adminApi, ApiResponse } from "@/lib/api";

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

type StudentPointRecord = {
  userId: number;
  userName: string;
  email: string;
  totalMileage?: number;
  mileage?: number;
};

type MileageUsersResponse = {
  users?: StudentPointRecord[];
  content?: StudentPointRecord[];
};

type PointHistoryResponse = {
  content?: PointHistory[];
};

export const getStudentsPoints = async (): Promise<StudentPointInfo[]> => {
  const response = await adminApi.get<
    ApiResponse<MileageUsersResponse | StudentPointRecord[]>
  >("/api/v1/admin/mileages");

  const data = response.data;
  const users = Array.isArray(data)
    ? data
    : data.users || data.content || [];

  return users.map((item) => ({
    userId: item.userId,
    userName: item.userName,
    email: item.email,
    totalPoint: item.totalMileage ?? item.mileage ?? 0,
  }));
};

export const givePoints = async (payload: PointPayload) => {
  const { userId, ...restPayload } = payload;

  const response = await adminApi.post<ApiResponse<unknown>>(
    `/api/v1/admin/mileages/users/${userId}/earn`,
    restPayload
  );

  return response.data;
};

export const recallPoints = async (payload: PointPayload) => {
  const { userId, ...restPayload } = payload;

  const response = await adminApi.post<ApiResponse<unknown>>(
    `/api/v1/admin/mileages/users/${userId}/use`,
    restPayload
  );

  return response.data;
};

export const getPointHistory = async (
  userId: number
): Promise<PointHistory[]> => {
  const response = await adminApi.get<
    ApiResponse<PointHistory[] | PointHistoryResponse>
  >(`/api/v1/admin/mileages/users/${userId}/histories`, {
    params: { t: Date.now() },
  });

  const data = response.data;

  if (Array.isArray(data)) return data;
  if (Array.isArray(data.content)) return data.content;

  return [];
};