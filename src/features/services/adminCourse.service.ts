// src/features/services/adminCourse.service.ts

import axios from "axios";
import { api } from "@/lib/api";

export interface AdminCourse {
  courseId: number;
  countryId: number;
  managerId?: number;
  title: string;
  description?: string;
  price?: number;
  thumbnailUrl?: string | null;
  fileUrls?: string[];
  level?: string;
  levelName?: string;
  status?: string;
  countryName?: string;
  isPublic?: boolean;
  studentCount?: number;
  chapterCount?: number;
  createdAt?: string;
}

const getErrorMessage = (error: unknown, fallbackMessage: string) => {
  if (axios.isAxiosError(error)) {
    console.log("강의 조회 실패 상세:", {
      baseURL: error.config?.baseURL,
      url: error.config?.url,
      params: error.config?.params,
      status: error.response?.status,
      data: error.response?.data,
    });

    return error.response?.data?.message || fallbackMessage;
  }

  if (error instanceof Error) {
    return error.message || fallbackMessage;
  }

  return fallbackMessage;
};

export const getAdminCourses = async (): Promise<AdminCourse[]> => {
  try {
    const response = await api.get("/api/v1/admin/courses", {
      params: {
        page: 0,
        size: 10,
      },
    });

    const data = response.data.data;

    if (Array.isArray(data)) {
      return data;
    }

    if (Array.isArray(data?.content)) {
      return data.content;
    }

    return [];
  } catch (error: unknown) {
    throw new Error(
      getErrorMessage(error, "관리자 강의 목록 조회에 실패했습니다.")
    );
  }
};