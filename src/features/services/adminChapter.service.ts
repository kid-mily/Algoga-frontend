// src/features/services/adminChapter.service.ts

import { adminApi } from "@/lib/api";
import {
  AdminChapter,
  CreateAdminChapterPayload,
} from "../contentmanage/lecture/types";

// 1. 챕터 목록 조회
export const getAdminChapters = async (courseId: number): Promise<AdminChapter[]> => {
  try {
    const response = await adminApi.get(`/api/v1/admin/courses/${courseId}/chapters`);
    return response.data.data || response.data;
  } catch (error: any) {
    console.error("챕터 목록 조회 API 에러 상세:", error.response?.data || error);
    throw new Error(error.response?.data?.message || "챕터 목록 조회에 실패했습니다.");
  }
};

// 2. 챕터 등록
export const createAdminChapter = async (payload: CreateAdminChapterPayload) => {
  try {
    const formData = new FormData();
    const requestData = {
      title: payload.title,
      description: payload.description,
      durationSeconds: payload.durationSeconds,
      chapterOrder: payload.chapterOrder,
    };

    formData.append("request", new Blob([JSON.stringify(requestData)], { type: "application/json" }));
    formData.append("video", payload.video);

    const response = await adminApi.post(`/api/v1/admin/courses/${payload.courseId}/chapters`, formData);
    return response.data;
  } catch (error: any) {
    console.error("챕터 등록 API 에러 상세:", error.response?.data || error);
    throw new Error(error.response?.data?.message || "챕터 등록에 실패했습니다.");
  }
};

// 3. 챕터 수정 (updateAdminChapter)
export const updateAdminChapter = async (
  courseId: number,
  chapterId: number,
  payload: {
    title: string;
    description: string;
    durationSeconds: number;
    chapterOrder: number;
    video?: File | null;
  }
) => {
  try {
    const formData = new FormData();
    const requestData = {
      title: payload.title,
      description: payload.description,
      durationSeconds: payload.durationSeconds,
      chapterOrder: payload.chapterOrder,
    };

    formData.append("request", new Blob([JSON.stringify(requestData)], { type: "application/json" }));
    
    if (payload.video) {
      formData.append("video", payload.video);
    }

    const response = await adminApi.put(`/api/v1/admin/courses/${courseId}/chapters/${chapterId}`, formData);
    return response.data;
  } catch (error: any) {
    console.error("🔥 챕터 수정 백엔드 에러 상세:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "챕터 수정에 실패했습니다.");
  }
};

// 4. 챕터 삭제
export const deleteAdminChapter = async (courseId: number, chapterId: number) => {
  try {
    const response = await adminApi.delete(`/api/v1/admin/courses/${courseId}/chapters/${chapterId}`);
    return response.data;
  } catch (error: any) {
    console.error("챕터 삭제 API 에러 상세:", error.response?.data || error);
    throw new Error(error.response?.data?.message || "챕터 삭제에 실패했습니다.");
  }
};
