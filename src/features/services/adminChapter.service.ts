import { adminApi, ApiResponse } from "@/lib/api";
import {
  AdminChapter,
  AdminChapterRecord,
  CreateAdminChapterPayload,
  UpdateChapterPayload,
} from "../contentmanage/lecture/types";

const normalizeChapter = (
  chapter: AdminChapterRecord,
  courseId: number
): AdminChapter => ({
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
});

export const getAdminChapters = async (
  courseId: number
): Promise<AdminChapter[]> => {
  const response = await adminApi.get<ApiResponse<AdminChapterRecord[]>>(
    `/api/v1/admin/courses/${courseId}/chapters`
  );

  return Array.isArray(response.data)
    ? response.data.map((chapter) => normalizeChapter(chapter, courseId))
    : [];
};

export const createAdminChapter = async (
  payload: CreateAdminChapterPayload
) => {
  const formData = new FormData();

  formData.append(
    "request",
    new Blob(
      [
        JSON.stringify({
          title: payload.title,
          description: payload.description,
          durationSeconds: payload.durationSeconds,
          chapterOrder: payload.chapterOrder,
        }),
      ],
      { type: "application/json" }
    )
  );

  formData.append("video", payload.video);

  const response = await adminApi.post<ApiResponse<AdminChapterRecord>>(
    `/api/v1/admin/courses/${payload.courseId}/chapters`,
    formData
  );

  return normalizeChapter(response.data, payload.courseId);
};

export const updateAdminChapter = async (
  courseId: number,
  chapterId: number,
  payload: UpdateChapterPayload
) => {
  const formData = new FormData();

  formData.append(
    "request",
    new Blob(
      [
        JSON.stringify({
          title: payload.title,
          description: payload.description,
          durationSeconds: payload.durationSeconds,
          chapterOrder: payload.chapterOrder,
        }),
      ],
      { type: "application/json" }
    )
  );

  if (payload.video) {
    formData.append("video", payload.video);
  }

  const response = await adminApi.put<ApiResponse<AdminChapterRecord>>(
    `/api/v1/admin/courses/${courseId}/chapters/${chapterId}`,
    formData
  );

  return normalizeChapter(response.data, courseId);
};

export const deleteAdminChapter = async (
  courseId: number,
  chapterId: number
) => {
  return adminApi.delete(
    `/api/v1/admin/courses/${courseId}/chapters/${chapterId}`
  );
};