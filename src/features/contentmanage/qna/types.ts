export type AdminQnaComment = {
  id: number;
  writer: string;
  content: string;
  createdAt: string;
};

export type AdminQnaBase = {
  id: number;
  userId: number;
  title: string;
  content: string;
  writer: string;
  createdAt: string;
  isAnswered: boolean;
  comments: AdminQnaComment[];
};

export type AdminQnaItem = AdminQnaBase & {
  courseId: number;
  lecture: string;
};

export type QnaStatusFilter = "all" | "answered" | "waiting";
