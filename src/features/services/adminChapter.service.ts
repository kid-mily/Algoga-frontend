import { adminApi } from "@/lib/api";
import { getErrorMessage } from "@/features/common/utils/getErrorMessage";
import {
  AdminChapter,
  AdminChapterRecord,
  CreateAdminChapterPayload,
  UpdateChapterPayload,
} from "../contentmanage/lecture/types";

const normalizeChapter = (
  chapter: AdminChapterRecord,
  courseId: number
): AdminChapter => {
  return {
    chapterId: chapter.chapterId ?? chapter.id ?? chapter.chapter_id ?? 0,
    courseId: chapter.courseId ?? chapter.course_id ?? courseId,
    title: chapter.title ?? chapter.chapterTitle ?? chapter.chapter_title ?? "",
    description:
      chapter.description ??
      chapter.chapterDescription ??
      chapter.chapter_description ??
      chapter.chapterContent ??
      chapter.chapter_content ??
      chapter.content ??
      chapter.contents ??
      chapter.summary ??
      chapter.detail ??
      chapter.details ??
      chapter.intro ??
      chapter.introduction ??
      "",
    durationSeconds: chapter.durationSeconds ?? chapter.duration_seconds ?? 0,
    chapterOrder: chapter.chapterOrder ?? chapter.chapter_order ?? 1,
    videoUrl: chapter.videoUrl ?? chapter.video_url ?? "",
  };
};

export const getAdminChapters = async (
  courseId: number
): Promise<AdminChapter[]> => {
  try {
    const response = await adminApi.get(
      `/api/v1/admin/courses/${courseId}/chapters`
    );
    const data =
      response.data.data?.content ||
      response.data.data?.chapters ||
      response.data.data ||
      response.data;

    if (!Array.isArray(data)) {
      return [];
    }

    return data.map((chapter) => normalizeChapter(chapter, courseId));
  } catch (error: unknown) {
    console.error("챕터 목록 조회 API 에러:", error);
    throw new Error(getErrorMessage(error, "챕터 목록 조회에 실패했습니다."));
  }
};

export const getAdminChapter = async (
  courseId: number,
  chapterId: number
): Promise<AdminChapter> => {
  try {
    const response = await adminApi.get(
      `/api/v1/admin/courses/${courseId}/chapters/${chapterId}`
    );
    const data =
      response.data.data?.chapter ||
      response.data.data?.content ||
      response.data.data ||
      response.data;

    return normalizeChapter(data, courseId);
  } catch (error: unknown) {
    console.error("챕터 상세 조회 API 에러:", error);
    throw new Error(getErrorMessage(error, "챕터 상세 조회에 실패했습니다."));
  }
};

export const createAdminChapter = async (
  payload: CreateAdminChapterPayload
) => {
  try {
    const formData = new FormData();
    const requestData = {
      title: payload.title,
      description: payload.description,
      durationSeconds: payload.durationSeconds,
      chapterOrder: payload.chapterOrder,
    };

    formData.append(
      "request",
      new Blob([JSON.stringify(requestData)], { type: "application/json" })
    );
    formData.append("video", payload.video);

    const response = await adminApi.post(
      `/api/v1/admin/courses/${payload.courseId}/chapters`,
      formData
    );
    return response.data;
  } catch (error: unknown) {
    console.error("챕터 등록 API 에러:", error);
    throw new Error(getErrorMessage(error, "챕터 등록에 실패했습니다."));
  }
};

export const updateAdminChapter = async (
  courseId: number,
  chapterId: number,
  payload: UpdateChapterPayload
) => {
  try {
    const formData = new FormData();
    const requestData = {
      title: payload.title,
      description: payload.description,
      durationSeconds: payload.durationSeconds,
      chapterOrder: payload.chapterOrder,
    };

    formData.append(
      "request",
      new Blob([JSON.stringify(requestData)], { type: "application/json" })
    );

    if (payload.video) {
      formData.append("video", payload.video);
    }

    const response = await adminApi.put(
      `/api/v1/admin/courses/${courseId}/chapters/${chapterId}`,
      formData
    );
    return response.data;
  } catch (error: unknown) {
    console.error("챕터 수정 API 에러:", error);
    throw new Error(getErrorMessage(error, "챕터 수정에 실패했습니다."));
  }
};

export const deleteAdminChapter = async (
  courseId: number,
  chapterId: number
) => {
  try {
    const response = await adminApi.delete(
      `/api/v1/admin/courses/${courseId}/chapters/${chapterId}`
    );
    return response.data;
  } catch (error: unknown) {
    console.error("챕터 삭제 API 에러:", error);
    throw new Error(getErrorMessage(error, "챕터 삭제에 실패했습니다."));
  }
};
