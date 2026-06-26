"use client";

import { useParams, useRouter } from "next/navigation";
import CourseLearningSidebar from "@/features/classroom/learning/components/CourseLearningSidebar";
import { getQuizOptions } from "@/features/classroom/quiz/actions";
import { useCourseQuiz } from "@/features/classroom/quiz/hooks/useCourseQuiz";

interface QuizClientProps {
  initialCourseTitle: string;
  description: string;
}

const OPTION_LABELS = ["A", "B", "C", "D"] as const;

const getParam = (
  value: string | string[] | undefined
) => {
  if (!value) return "";

  return decodeURIComponent(
    Array.isArray(value) ? value[0] : value
  );
};

export default function QuizClient({
  initialCourseTitle,
  description,
}: QuizClientProps) {
  const params = useParams();
  const router = useRouter();

  const continentCode = getParam(
    params.continentCode
  );
  const countryId = getParam(params.countryid);
  const courseId = getParam(params.courseId);

  const lectureHref =
    `/classroom/${continentCode}/${countryId}/lecture/${courseId}`;
  const studyHref = `${lectureHref}/study`;
  const quizHref = `${lectureHref}/quiz`;
  const completeHref = `${quizHref}/complete`;
  const qnaHref = `${lectureHref}/qna`;
  const certificateHref =
    `/mypage/coursedetails/${courseId}/certificate`;

  const quiz = useCourseQuiz(
    courseId,
    completeHref,
    initialCourseTitle
  );

  const currentQuiz = quiz.currentQuiz;

  const selectedOption = currentQuiz
    ? quiz.selectedAnswers[currentQuiz.quizId]
    : undefined;

  return (
    <main className="flex h-[calc(100dvh-64px)] overflow-hidden bg-[#F5F7FB]">
      <CourseLearningSidebar
        courseTitle={quiz.courseTitle}
        chapters={quiz.chapters}
        quizAvailable={quiz.quizzes.length > 0}
        courseCompleted={false}
        mode="quiz"
        lectureHref={lectureHref}
        studyHref={studyHref}
        quizHref={quizHref}
        quizResultHref={completeHref}
        certificateHref={certificateHref}
        qnaHref={qnaHref}
        onChapterSelect={() =>
          router.push(studyHref)
        }
      />

      <section className="min-w-0 flex-1 overflow-y-auto p-4">
        <div className="mx-auto max-w-[820px]">
          <header className="rounded-[18px] border border-[#E8EEF5] bg-white px-5 py-4 shadow-sm">
            <h1 className="text-lg font-bold text-[#0A1628]">
              퀴즈
            </h1>

            <p className="mt-1 text-xs leading-5 text-[#8A9BB0]">
              {description}
            </p>
          </header>

          {quiz.isLoading ? (
            <section className="mt-3 flex h-[420px] items-center justify-center rounded-[20px] bg-white shadow-sm">
              <p className="text-sm text-[#8A9BB0]">
                퀴즈를 불러오는 중입니다.
              </p>
            </section>
          ) : null}

          {!quiz.isLoading && !currentQuiz ? (
            <section className="mt-3 flex h-[420px] flex-col items-center justify-center rounded-[20px] bg-white px-8 text-center shadow-sm">
              <h2 className="font-bold text-[#0A1628]">
                퀴즈를 시작할 수 없습니다
              </h2>

              <p className="mt-2 text-sm text-red-500">
                {quiz.errorMessage ||
                  "등록된 퀴즈가 없습니다."}
              </p>

              <button
                type="button"
                onClick={() =>
                  router.push(studyHref)
                }
                className="mt-5 h-11 rounded-[14px] bg-[#5E9F9B] px-5 text-sm font-bold text-white"
              >
                강의로 돌아가기
              </button>
            </section>
          ) : null}

          {!quiz.isLoading && currentQuiz ? (
            <section className="mt-3 rounded-[20px] border border-[#E8EEF5] bg-white px-7 py-5 shadow-sm">
              <div className="flex justify-between text-xs">
                <strong className="text-[#2F9E6F]">
                  문제 {quiz.currentIndex + 1}
                </strong>

                <span className="text-[#8A9BB0]">
                  {quiz.currentIndex + 1} /{" "}
                  {quiz.quizzes.length}
                </span>
              </div>

              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#E7ECF3]">
                <div
                  className="h-full rounded-full bg-[#2F9E6F] transition-[width]"
                  style={{
                    width: `${
                      ((quiz.currentIndex + 1) /
                        quiz.quizzes.length) *
                      100
                    }%`,
                  }}
                />
              </div>

              <h2 className="mt-4 text-base font-bold leading-6 text-[#0A1628]">
                {currentQuiz.question}
              </h2>

              <div
                className="mt-4 space-y-2"
                role="radiogroup"
                aria-label={`문제 ${
                  quiz.currentIndex + 1
                } 보기`}
              >
                {getQuizOptions(currentQuiz).map(
                  (option, index) => {
                    const optionNumber = index + 1;
                    const selected =
                      selectedOption === optionNumber;

                    return (
                      <button
                        key={`${currentQuiz.quizId}-${optionNumber}`}
                        type="button"
                        role="radio"
                        aria-checked={selected}
                        disabled={quiz.isSubmitting}
                        onClick={() =>
                          quiz.selectAnswer(
                            optionNumber
                          )
                        }
                        className={`flex min-h-12 w-full items-center gap-3 rounded-[16px] border px-4 py-2.5 text-left text-sm font-bold transition ${
                          selected
                            ? "border-[#5E9F9B] bg-[#EFF7F6] text-[#243247]"
                            : "border-[#E4EAF1] bg-white text-[#243247] hover:border-[#8AB9B7]"
                        } disabled:cursor-not-allowed disabled:opacity-60`}
                      >
                        <span
                          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs ${
                            selected
                              ? "bg-[#5E9F9B] text-white"
                              : "bg-[#EFF7FF] text-[#6D9F9B]"
                          }`}
                        >
                          {OPTION_LABELS[index]}
                        </span>

                        <span className="break-words">
                          {option}
                        </span>
                      </button>
                    );
                  }
                )}
              </div>

              {quiz.errorMessage ? (
                <p
                  role="alert"
                  className="mt-3 rounded-[14px] bg-red-50 px-3 py-2 text-center text-xs font-bold text-red-500"
                >
                  {quiz.errorMessage}
                </p>
              ) : null}

              <div className="mt-4 flex gap-2">
                <button
                  type="button"
                  disabled={
                    quiz.currentIndex === 0 ||
                    quiz.isSubmitting
                  }
                  onClick={quiz.previous}
                  className="h-12 w-24 rounded-[16px] border border-[#DCE5F0] bg-white text-sm font-bold text-[#243247] disabled:opacity-40"
                >
                  이전
                </button>

                <button
                  type="button"
                  disabled={
                    selectedOption === undefined ||
                    quiz.isSubmitting
                  }
                  onClick={quiz.nextOrSubmit}
                  className="h-12 flex-1 rounded-[16px] bg-[#5E9F9B] text-sm font-bold text-white disabled:opacity-50"
                >
                  {quiz.isSubmitting
                    ? "제출 중..."
                    : quiz.currentIndex ===
                        quiz.quizzes.length - 1
                      ? "제출하기"
                      : "다음 문제"}
                </button>
              </div>
            </section>
          ) : null}
        </div>
      </section>
    </main>
  );
}