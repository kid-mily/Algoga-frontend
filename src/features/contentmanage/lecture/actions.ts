import {
  createAdminCourse,
  deleteAdminCourse,
  getAdminCourse,
  getAdminCourses,
  getAdminDeletedCourses,
  getCourseCountries,
  updateAdminCourse,
} from "@/features/services/adminCourse.service";
import {
  createAdminChapter,
  deleteAdminChapter,
  getAdminChapters,
  updateAdminChapter,
} from "@/features/services/adminChapter.service";
import {
  CreateAdminChapterPayload,
  CreateAdminCoursePayload,
  DeletedCourseQueryParams,
  UpdateChapterPayload,
  UpdateLecturePayload,
} from "./types";

export const getLectureListAction = (signal?: AbortSignal) => {
  return getAdminCourses(signal);
};

export const getLectureCountriesAction = (signal?: AbortSignal) => {
  return getCourseCountries(signal);
};

export const getDeletedLectureListAction = (
  params: DeletedCourseQueryParams,
  signal?: AbortSignal
) => {
  return getAdminDeletedCourses(params, signal);
};

export const getLectureDetailAction = (lectureId: number) => {
  return getAdminCourse(lectureId);
};

export const createLectureAction = (payload: CreateAdminCoursePayload) => {
  return createAdminCourse(payload);
};

export const updateLectureAction = (
  lectureId: number,
  payload: UpdateLecturePayload
) => {
  return updateAdminCourse(lectureId, payload);
};

export const deleteLectureAction = (lectureId: number) => {
  return deleteAdminCourse(lectureId);
};

export const getChapterListAction = (lectureId: number) => {
  return getAdminChapters(lectureId);
};

export const createChapterAction = (payload: CreateAdminChapterPayload) => {
  return createAdminChapter(payload);
};

export const updateChapterAction = (
  lectureId: number,
  chapterId: number,
  payload: UpdateChapterPayload
) => {
  return updateAdminChapter(lectureId, chapterId, payload);
};

export const deleteChapterAction = (lectureId: number, chapterId: number) => {
  return deleteAdminChapter(lectureId, chapterId);
};