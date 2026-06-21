import type { CourseStudyChapter } from "@/features/services/courseStudy.service";

export interface CourseQuiz {
    quizId: number;
    courseId: number;
    question: string;
    option1: string;
    option2: string;
    option3: string;
    option4: string;
}

export interface CourseQuizAnswer {
    quizId: number;
    selectedOption: 1 | 2 | 3 | 4;
}

export interface CourseQuizWrongAnswer {
    quizId: number;
    selectedOption: number;
    correctOption: number;
    question?: string;
    explanation?: string;
}

export interface CourseQuizSubmitResult {
    userId: number;
    courseId: number;
    totalCount: number;
    correctCount: number;
    score: number;
    wrongAnswers: CourseQuizWrongAnswer[];
}

export interface QuizState {
    courseTitle: string;
    chapters: CourseStudyChapter[];
    quizzes: CourseQuiz[];
    currentIndex: number;
    selectedAnswers: Record<number, number>;
    isLoading: boolean;
    isSubmitting: boolean;
    errorMessage: string;
}

export interface CourseQuizAttempt {
    result: CourseQuizSubmitResult;
    quizzes: CourseQuiz[];
    selectedAnswers: Record<number, number>;
}