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
