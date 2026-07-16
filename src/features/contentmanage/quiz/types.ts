export interface AdminQuiz {
  quizId: number;
  courseId: number;
  lectureTitle?: string;
  question: string;
  option1: string;
  option2: string;
  option3: string;
  option4: string;
  correctOption: number;
  explanation?: string;
}

export type AdminQuizWithLecture = AdminQuiz & {
  lectureTitle?: string;
};

export interface CreateAdminQuizPayload {
  courseId: number;
  question: string;
  option1: string;
  option2: string;
  option3: string;
  option4: string;
  correctOption: number;
  explanation?: string;
}

export interface UpdateAdminQuizPayload {
  question: string;
  option1: string;
  option2: string;
  option3: string;
  option4: string;
  correctOption: number;
  explanation?: string;
}

export type QuizFormMode = "create" | "edit";

export type QuizFormData = {
  quizId?: number;
  courseId: number;
  question: string;
  option1: string;
  option2: string;
  option3: string;
  option4: string;
  correctOption: number;
  explanation: string;
};

export type QuizFormProps = {
  mode?: QuizFormMode;
  initialQuiz?: QuizFormData;
  defaultCourseId?: number;
};

export type QuizCardProps = {
  lectureTitle: string;
  question: string;
  options: string[];
  answer: string;
  explanation?: string;
  onView?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
};

export type QuizListProps = {
  quizzes?: AdminQuizWithLecture[];
  quizCountByCourse?: Record<number, number>;
  onDeleted?: () => void;
};

export type QuizToolbarProps = {
  searchKeyword: string;
  selectedLecture: string;
  courses: import("../lecture/types").AdminCourse[];
  createHref?: string;
  selectedCourseQuizCount?: number;
  onSearchKeywordChange: (value: string) => void;
  onSelectedLectureChange: (value: string) => void;
};

export type EditQuizClientProps = {
  quizId: number;
  courseId: number;
};

export type QuizManageClientProps = {
  initialCourseId?: string;
};

export type CreateQuizClientProps = {
  defaultCourseId?: number;
};

export const MAX_QUIZ_COUNT = 5;

export type LectureQuizDraft = {
  id: number;
  question: string;
  options: string[];
  correctOption: number;
  explanation: string;
};

export type LectureQuizDraftErrors = {
  question?: string;
  options?: string[];
  correctOption?: string;
};
