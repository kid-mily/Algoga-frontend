import { adminApi, ApiResponse } from "@/lib/api";
import { readPage } from "@/lib/pagination";
import {
  PointHistory,
  PointHistoryPage,
  PointPayload,
  StudentPointPage,
  StudentPointRecord,
} from "@/features/contentmanage/point/types";

export const getStudentsPoints = async (
  params: { page: number; size: number },
  signal?: AbortSignal
): Promise<StudentPointPage> => {
  const response = await adminApi.get<ApiResponse<unknown>>(
    "/api/v1/admin/mileages",
    { params: { page: params.page, size: params.size }, signal }
  );

  const data = response.data;
  // 응답의 "users" 필드가 페이지 객체(신버전) 또는 배열(구버전)이 될 수 있고,
  // totalUserCount/totalMileage 등 나머지 필드는 전체 기준 값으로 같은 레벨에 온다.
  const usersSource =
    data && typeof data === "object" && !Array.isArray(data) && "users" in data
      ? (data as { users: unknown }).users
      : data;
  const { content, meta } = readPage<StudentPointRecord>(usersSource);

  const students = content.map((item) => {
    const userName =
      item.userName?.trim() ||
      item.name?.trim() ||
      item.nickname?.trim() ||
      `사용자 #${item.userId}`;

    return {
      userId: item.userId,
      userName,
      email: item.email,
      totalPoint: item.totalMileage ?? item.mileage ?? 0,
    };
  });

  return {
    students,
    page: meta.page,
    totalPages: meta.totalPages,
    totalElements: meta.totalElements,
  };
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
  params: { page: number; size: number },
  signal?: AbortSignal
): Promise<PointHistoryPage> => {
  const response = await adminApi.get<ApiResponse<unknown>>(
    `/api/v1/admin/mileages/users/${userId}/histories`,
    {
      params: { page: params.page, size: params.size, t: Date.now() },
      signal,
    }
  );

  const { content, meta } = readPage<PointHistory>(response.data);

  return {
    histories: content,
    page: meta.page,
    totalPages: meta.totalPages,
    totalElements: meta.totalElements,
  };
};
