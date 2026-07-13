export interface CourseQuiz {
    quizId: number;
    courseId: number;
    question: string;
    option1: string;
    option2: string;
    option3: string;
    option4: string;
}

export interface CourseQuizWrongAnswer {
    quizId: number;
    question: string;
    selectedOption: 1 | 2 | 3 | 4;
    correctOption: 1 | 2 | 3 | 4;
    explanation: string;
}

export interface CourseQuizCompletion {
    completionId: number;
    userId: number;
    courseId: number;
    certificateCode: string;
    completedAt: string;
}

export interface CourseQuizSubmitResult {
    userId: number;
    courseId: number;
    totalCount: number;
    correctCount: number;
    score: number;
    courseCompleted: boolean;
    completion: CourseQuizCompletion | null;
    wrongAnswers: CourseQuizWrongAnswer[];
}

export interface CourseQuizResultAnswer {
    answerId: number;
    quizId: number;
    question: string;
    option1: string;
    option2: string;
    option3: string;
    option4: string;
    selectedOption: 1 | 2 | 3 | 4;
    selectedAnswer: string;
    correctOption: 1 | 2 | 3 | 4;
    correctAnswer: string;
    correct: boolean;
    explanation: string;
}

export interface CourseQuizSavedResult {
    submissionId: number;
    userId: number;
    courseId: number;
    totalCount: number;
    correctCount: number;
    score: number;
    submittedAt: string;
    answers: CourseQuizResultAnswer[];
}

export interface CourseQuizAttempt {
    result: CourseQuizSavedResult;
    quizzes: CourseQuiz[];
    selectedAnswers: Record<number, number>;
}

export interface CourseQuizAnswer {
    quizId: number;
    selectedOption: 1 | 2 | 3 | 4;
}
