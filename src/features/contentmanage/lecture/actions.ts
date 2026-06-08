import {
  createAdminCourse,
  deleteAdminCourse,
  getAdminCourse,
  getAdminCourses,
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
} from "./types";

type UpdateLecturePayload = {
  countryId: number;
  title: string;
  description: string;
  price: number;
  level: string;
  status: string;
  thumbnail?: File;
  files?: File[];
};

type UpdateChapterPayload = {
  title: string;
  description: string;
  durationSeconds: number;
  chapterOrder: number;
  video?: File | null;
};

export const getLectureListAction = () => {
  return getAdminCourses();
};

export const getLectureCountriesAction = () => {
  return getCourseCountries();
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
