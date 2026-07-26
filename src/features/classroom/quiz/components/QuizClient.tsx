"use client";

import { useParams, useRouter } from "next/navigation";
import CourseLearningSidebar from "@/features/classroom/learning/components/CourseLearningSidebar";
import { getQuizOptions, type CourseQuizLoadResult } from "@/features/classroom/quiz/actions";
import { useCourseQuiz } from "@/features/classroom/quiz/hooks/useCourseQuiz";

interface QuizClientProps {
  description: string;
  initialData: CourseQuizLoadResult;
}

const OPTION_LABELS = ["A", "B", "C", "D"] as const;

const getParam = (value: string | string[] | undefined) => {
  if (!value) return "";
  return decodeURIComponent(Array.isArray(value) ? value[0] : value);
};

export default function QuizClient({
  description,
  initialData,
}: QuizClientProps) {
  const params = useParams();
  const router = useRouter();

  const continentCode = getParam(params.continentCode).toLowerCase();
  const countryId = getParam(params.countryid);
  const courseId = getParam(params.courseId);

  const lectureHref = `/classroom/${continentCode}/${countryId}/lecture/${courseId}`;
  const studyHref = `${lectureHref}/study`;
  const quizHref = `${lectureHref}/quiz`;
  const completeHref = `${quizHref}/complete`;
  const qnaHref = `${lectureHref}/qna`;
  const certificateHref = `/mypage/coursedetails/${courseId}/certificate`;

  const quiz = useCourseQuiz(courseId, completeHref, initialData);
  const currentQuiz = quiz.currentQuiz;

  const selectedOption = currentQuiz
    ? quiz.selectedAnswers[currentQuiz.quizId]
    : undefined;

  return (
    <main className="flex h-[calc(100dvh-64px)] overflow-hidden bg-[#F3F8FC]">
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
        onChapterSelect={() => router.push(studyHref)}
      />

      <section className="min-w-0 flex-1 px-5 py-6 lg:px-8">
        <div className="mx-auto max-w-[860px]">
          <header className="rounded-2xl border border-[#DDE8EF] bg-white px-6 py-4 shadow-[0_12px_32px_rgba(55,88,110,0.08)]">
            <p className="text-xs font-bold tracking-[0.22em] text-[#439A97]">
              TRAVEL QUIZ
            </p>

            <h1 className="mt-2 text-2xl font-bold text-[#0A1628]">
              퀴즈
            </h1>

            <p className="mt-2 text-sm leading-6 text-[#718096]">
              {description}
            </p>
          </header>

          {!currentQuiz ? (
            <section className="mt-4 flex h-[420px] flex-col items-center justify-center rounded-2xl border border-[#E1E8EF] bg-white px-8 text-center shadow-[0_8px_24px_rgba(55,88,110,0.07)]">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#FFF4E8] text-lg font-bold text-[#A87512]">
                !
              </div>

              <h2 className="mt-4 text-lg font-bold text-[#0A1628]">
                퀴즈를 시작할 수 없습니다.
              </h2>

              <p className="mt-2 text-sm text-red-500">
                {quiz.errorMessage || "등록된 퀴즈가 없습니다."}
              </p>

              <button
                type="button"
                onClick={() => router.push(studyHref)}
                className="mt-5 h-11 rounded-2xl bg-[#439A97] px-5 text-sm font-bold text-white transition hover:bg-[#357F7C]"
              >
                강의로 돌아가기
              </button>
            </section>
          ) : null}

          {currentQuiz ? (
            <section className="mt-4 rounded-2xl border border-[#E1E8EF] bg-white px-7 py-6 shadow-[0_8px_24px_rgba(55,88,110,0.07)]">
              <div className="flex justify-between text-xs">
                <strong className="text-[#439A97]">
                  문제 {quiz.currentIndex + 1}
                </strong>

                <span className="text-[#8A94A6]">
                  {quiz.currentIndex + 1} / {quiz.quizzes.length}
                </span>
              </div>

              <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#E7ECF3]">
                <div
                  className="h-full rounded-full bg-[#439A97] transition-[width]"
                  style={{
                    width: `${((quiz.currentIndex + 1) / quiz.quizzes.length) * 100}%`,
                  }}
                />
              </div>

              <h2 className="mt-6 text-lg font-bold leading-7 text-[#0A1628]">
                {currentQuiz.question}
              </h2>

              <div
                className="mt-5 space-y-3"
                role="radiogroup"
                aria-label={`문제 ${quiz.currentIndex + 1} 보기`}
              >
                {getQuizOptions(currentQuiz).map((option, index) => {
                  const optionNumber = index + 1;
                  const selected = selectedOption === optionNumber;

                  return (
                    <button
                      key={`${currentQuiz.quizId}-${optionNumber}`}
                      type="button"
                      role="radio"
                      aria-checked={selected}
                      disabled={quiz.isSubmitting}
                      onClick={() => quiz.selectAnswer(optionNumber)}
                      className={`flex min-h-12 w-full items-center gap-3 rounded-2xl border px-4 py-3 text-left text-sm font-bold transition ${
                        selected
                          ? "border-[#439A97] bg-[#EEF8F7] text-[#243247]"
                          : "border-[#E4EAF1] bg-white text-[#243247] hover:border-[#8AB9B7]"
                      } disabled:cursor-not-allowed disabled:opacity-60`}
                    >
                      <span
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs ${
                          selected
                            ? "bg-[#439A97] text-white"
                            : "bg-[#EFF7F6] text-[#439A97]"
                        }`}
                      >
                        {OPTION_LABELS[index]}
                      </span>

                      <span className="break-words">{option}</span>
                    </button>
                  );
                })}
              </div>

              {quiz.errorMessage ? (
                <p
                  role="alert"
                  className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-center text-xs font-bold text-red-500"
                >
                  {quiz.errorMessage}
                </p>
              ) : null}

              <div className="mt-5 flex gap-2">
                <button
                  type="button"
                  disabled={quiz.currentIndex === 0 || quiz.isSubmitting}
                  onClick={quiz.previous}
                  className="h-12 w-24 rounded-2xl border border-[#DCE5F0] bg-white text-sm font-bold text-[#243247] disabled:opacity-40"
                >
                  이전
                </button>

                <button
                  type="button"
                  disabled={selectedOption === undefined || quiz.isSubmitting}
                  onClick={quiz.nextOrSubmit}
                  className="h-12 flex-1 rounded-2xl bg-[#439A97] text-sm font-bold text-white transition hover:bg-[#357F7C] disabled:opacity-50"
                >
                  {quiz.isSubmitting
                    ? "제출 중..."
                    : quiz.currentIndex === quiz.quizzes.length - 1
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