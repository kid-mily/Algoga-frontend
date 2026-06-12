import { CourseQna } from "@/features/classroom/qna/types";

export type AdminQnaItem = CourseQna & {
  courseId: number;
  lecture: string;
};

export type QnaStatusFilter = "all" | "answered" | "waiting";
