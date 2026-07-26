import { CourseQuiz, CourseQuizAnswer, CourseQuizAttempt } from "./types";
import type { CourseStudyChapter } from "@/features/services/courseStudy.service";
import { getCourseStudyDetail } from "@/features/services/courseStudy.service";
import {
  getCourseQuizzes,
  getCourseQuizResult,
} from "@/features/services/courseQuiz.service";
import { areAllChaptersCompleted } from "../learning/actions";

export interface CourseQuizLoadResult {
  courseTitle: string;
  chapters: CourseStudyChapter[];
  quizzes: CourseQuiz[];
  canTakeQuiz: boolean;
  errorMessage: string;
}

// study/actions.ts의 loadLectureStudy와 동일하게, 서버 컴포넌트에서 먼저 시도하고
// 실패하면(네트워크/401 등) 그대로 던져서 클라이언트 훅이 기존 방식으로 재조회하게 한다.
export const loadCourseQuiz = async (
  courseId: string,
  signal?: AbortSignal,
  headers?: HeadersInit
): Promise<CourseQuizLoadResult> => {
  const course = await getCourseStudyDetail(courseId, signal, headers);

  const chapters = [...course.chapters].sort(
    (a, b) => a.chapterOrder - b.chapterOrder
  );

  const canTakeQuiz =
    areAllChaptersCompleted(chapters) || course.quizAvailable === true;

  if (!canTakeQuiz) {
    return {
      courseTitle: course.title,
      chapters,
      quizzes: [],
      canTakeQuiz: false,
      errorMessage: "모든 챕터를 완료해야 퀴즈를 풀 수 있습니다.",
    };
  }

  const quizzes = await getCourseQuizzes(courseId, signal, headers);

  return {
    courseTitle: course.title,
    chapters,
    quizzes,
    canTakeQuiz: true,
    errorMessage: quizzes.length === 0 ? "등록된 퀴즈가 없습니다." : "",
  };
};

export interface QuizCompleteLoadResult {
  courseTitle: string;
  chapters: CourseStudyChapter[];
  attempt: CourseQuizAttempt;
}

// 퀴즈 결과 페이지용 — 저장된 결과가 없으면(404 등) 그대로 던져서 클라이언트가
// 기존 방식대로 재조회 후 "저장된 결과 없음" 화면을 보여주게 한다.
export const loadQuizCompleteResult = async (
  courseId: string,
  signal?: AbortSignal,
  headers?: HeadersInit
): Promise<QuizCompleteLoadResult> => {
  const [course, savedResult] = await Promise.all([
    getCourseStudyDetail(courseId, signal, headers),
    getCourseQuizResult(courseId, signal, headers),
  ]);

  const chapters = [...course.chapters].sort(
    (a, b) => a.chapterOrder - b.chapterOrder
  );

  const resultAnswers = savedResult.answers ?? [];

  const quizzes = resultAnswers.map((answer) => ({
    quizId: answer.quizId,
    courseId: savedResult.courseId,
    question: answer.question,
    option1: answer.option1,
    option2: answer.option2,
    option3: answer.option3,
    option4: answer.option4,
  }));

  const selectedAnswers = Object.fromEntries(
    resultAnswers.map((answer) => [answer.quizId, answer.selectedOption])
  );

  return {
    courseTitle: course.title,
    chapters,
    attempt: {
      result: {
        ...savedResult,
        answers: resultAnswers,
      },
      quizzes,
      selectedAnswers,
    },
  };
};

export const getQuizOptions = (quiz: CourseQuiz) => [
    quiz.option1,
    quiz.option2,
    quiz.option3,
    quiz.option4,
];

export const createQuizAnswers = (
    quizzes: CourseQuiz[],
    selections: Record<number, number>
    ): CourseQuizAnswer[] | null => {
    const answers = quizzes.map((quiz) => ({
        quizId: quiz.quizId,
        selectedOption: selections[quiz.quizId],
    }));

    const invalid = answers.some(
        ({ selectedOption }) =>
        selectedOption === undefined ||
        selectedOption < 1 ||
        selectedOption > 4
    );

    if (invalid) return null;

    return answers as CourseQuizAnswer[];
};