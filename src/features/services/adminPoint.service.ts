import { adminApi, ApiResponse } from "@/lib/api";
import {
  MileageUsersResponse,
  PointHistory,
  PointHistoryResponse,
  PointPayload,
  StudentPointInfo,
  StudentPointRecord,
} from "@/features/contentmanage/point/types";

export const getStudentsPoints = async (
  signal?: AbortSignal
): Promise<StudentPointInfo[]> => {
  const response = await adminApi.get<
    ApiResponse<MileageUsersResponse | StudentPointRecord[]>
  >("/api/v1/admin/mileages", { signal });

  const data = response.data;
  const users = Array.isArray(data)
    ? data
    : "users" in data
      ? data.users
      : data.content;

  return users.map((item) => ({
    userId: item.userId,
    userName: item.userName,
    email: item.email,
    totalPoint: item.totalMileage ?? item.mileage ?? 0,
  }));
};

export const givePoints = async (
  payload: PointPayload,
  signal?: AbortSignal
) => {
  const { userId, ...restPayload } = payload;

  const response = await adminApi.post<ApiResponse<unknown>>(
    `/api/v1/admin/mileages/users/${userId}/earn`,
    restPayload,
    { signal }
  );

  return response.data;
};

export const recallPoints = async (
  payload: PointPayload,
  signal?: AbortSignal
) => {
  const { userId, ...restPayload } = payload;

  const response = await adminApi.post<ApiResponse<unknown>>(
    `/api/v1/admin/mileages/users/${userId}/use`,
    restPayload,
    { signal }
  );

  return response.data;
};

export const getPointHistory = async (
  userId: number,
  signal?: AbortSignal
): Promise<PointHistory[]> => {
  const response = await adminApi.get<
    ApiResponse<PointHistory[] | PointHistoryResponse>
  >(`/api/v1/admin/mileages/users/${userId}/histories`, {
    params: { t: Date.now() },
    signal,
  });

  const data = response.data;

  if (Array.isArray(data)) return data;
  if (Array.isArray(data.content)) return data.content;

  console.warn("예상하지 못한 마일리지 내역 응답:", data);
  return [];
};
