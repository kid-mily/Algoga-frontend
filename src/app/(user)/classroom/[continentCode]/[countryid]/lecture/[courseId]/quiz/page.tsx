"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ApiRequestError } from "@/lib/api";
import LectureSideBar from "@/features/classroom/components/LectureSideBar";
import type {
  ChapterItem,
  VideoItem,
} from "@/features/classroom/components/types";
import {
  CourseQuiz,
  CourseQuizSubmitResult,
  getCourseQuizzes,
  submitCourseQuiz,
} from "@/features/services/courseQuiz.service";
import {
  CourseStudyChapter,
  getCourseStudyDetail,
} from "@/features/services/courseStudy.service";

const getParam = (value: string | string[] | undefined) => {
  if (!value) return "";
  return decodeURIComponent(Array.isArray(value) ? value[0] : value);
};

const optionLabels = ["A", "B", "C", "D"];

const getOptions = (quiz: CourseQuiz) => [
  quiz.option1,
  quiz.option2,
  quiz.option3,
  quiz.option4,
];

const formatDuration = (seconds?: number) => {
  if (!seconds) return "0분";
  return `${Math.ceil(seconds / 60)}분`;
};

const toSidebarChapters = (chapters: CourseStudyChapter[]): ChapterItem[] => {
  return chapters
    .slice()
    .sort((a, b) => a.chapterOrder - b.chapterOrder)
    .map((chapter) => ({
      chapterId: chapter.chapterId,
      chapterTitle: chapter.title,
      chapterNumber: `챕터 ${chapter.chapterOrder}`,
      progressRate: chapter.progressRate ?? 0,
      completed: chapter.completed ?? false,
      videos: [
        {
          videoId: chapter.chapterId,
          chapterId: chapter.chapterId,
          title: chapter.title,
          videoUrl: chapter.videoUrl,
          description: chapter.description ?? "",
          duration: formatDuration(chapter.durationSeconds),
        },
      ],
    }));
};

export default function QuizPage() {
  const params = useParams();
  const router = useRouter();

  const continentCode = getParam(params.continentCode);
  const countryId = getParam(params.countryid);
  const courseId = getParam(params.courseId);

  const [courseTitle, setCourseTitle] = useState("");
  const [chapters, setChapters] = useState<ChapterItem[]>([]);
  const [quizzes, setQuizzes] = useState<CourseQuiz[]>([]);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>(
    {}
  );
  const [submitResult, setSubmitResult] =
    useState<CourseQuizSubmitResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const firstQuiz = quizzes[0] ?? null;

  const selectedOption = firstQuiz
    ? selectedAnswers[firstQuiz.quizId]
    : undefined;

  const wrongAnswer = firstQuiz
    ? submitResult?.wrongAnswers?.find(
        (answer) => answer.quizId === firstQuiz.quizId
      )
    : undefined;

  const correctOption = wrongAnswer?.correctOption ?? selectedOption;

  const isSubmitted = Boolean(submitResult);

  const isCorrect =
    isSubmitted && firstQuiz && !wrongAnswer && selectedOption !== undefined;

  const isWrong = isSubmitted && firstQuiz && Boolean(wrongAnswer);

  useEffect(() => {
    if (!courseId) return;

    const fetchPageData = async () => {
      try {
        setIsLoading(true);
        setErrorMessage("");

        const [studyDetail, quizList] = await Promise.all([
          getCourseStudyDetail(courseId),
          getCourseQuizzes(courseId),
        ]);

        setCourseTitle(studyDetail.title);
        setChapters(toSidebarChapters(studyDetail.chapters ?? []));
        setQuizzes(quizList);
      } catch (error) {
        console.error("[quiz] 퀴즈 조회 실패:", error);

        if (error instanceof ApiRequestError) {
          if (error.status === 401) {
            router.replace("/auth/login");
            return;
          }

          if (error.status === 400) {
            setErrorMessage("모든 챕터를 완료한 후 퀴즈를 풀 수 있습니다.");
            return;
          }

          if (error.status === 403) {
            setErrorMessage("수강 등록된 강의가 아닙니다.");
            return;
          }

          if (error.status === 404) {
            setErrorMessage("해당 과정을 찾을 수 없습니다.");
            return;
          }
        }

        setErrorMessage("퀴즈 정보를 불러오지 못했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPageData();
  }, [courseId, router]);

  const handleSelectOption = (quizId: number, selectedOption: number) => {
    if (isSubmitted) return;

    setSelectedAnswers((prev) => ({
      ...prev,
      [quizId]: selectedOption,
    }));
  };

  const handleSubmit = async () => {
    if (quizzes.length === 0) return;

    const answers = quizzes.map((quiz) => ({
      quizId: quiz.quizId,
      selectedOption: selectedAnswers[quiz.quizId] ?? 0,
    }));

    const hasEmptyAnswer = answers.some((answer) => answer.selectedOption === 0);

    if (hasEmptyAnswer) {
      setErrorMessage("모든 문제의 답을 선택해 주세요.");
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage("");

      const result = await submitCourseQuiz(courseId, answers);

      setSubmitResult(result);

      sessionStorage.setItem(
        `quiz-result-${courseId}`,
        JSON.stringify(result)
      );
    } catch (error) {
      console.error("[quiz] 퀴즈 제출 실패:", error);

      if (error instanceof ApiRequestError) {
        setErrorMessage(error.message);
        return;
      }

      setErrorMessage("퀴즈 제출에 실패했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleComplete = () => {
    router.push(
      `/classroom/${continentCode}/${countryId}/lecture/${courseId}/quiz/complete`
    );
  };

  const handleVideoSelect = (_video: VideoItem) => {
    router.push(
      `/classroom/${continentCode}/${countryId}/lecture/${courseId}/study`
    );
  };

  if (isLoading) {
    return (
      <main className="grid min-h-screen grid-cols-[340px_1fr] bg-[#F5F7FB]">
        <div />
        <section className="flex items-center justify-center">
          <p className="text-sm text-[#8A9BB0]">
            퀴즈를 불러오는 중입니다.
          </p>
        </section>
      </main>
    );
  }

  return (
    <main className="grid min-h-screen grid-cols-[340px_1fr] bg-[#F5F7FB]">
      <LectureSideBar
        courseTitle={courseTitle}
        chapters={chapters}
        onVideoSelect={handleVideoSelect}
        backHref={`/classroom/${continentCode}/${countryId}/lecture/${courseId}`}
        backText="클래스룸으로"
      />

      <section className="px-10 py-8">
        <div className="mx-auto max-w-[1120px]">
          <article className="rounded-[22px] bg-white px-7 py-6 shadow-sm">
            <h1 className="text-xl font-bold text-[#0A1628]">퀴즈</h1>

            <p className="mt-3 text-[15px] leading-7 text-[#8A9BB0]">
              출발 전 정보를 다시 한번 점검해 보세요.
              <br />
              학습 내용을 바탕으로 퀴즈가 출제됩니다.
            </p>
          </article>

          {errorMessage && !firstQuiz && (
            <article className="mt-7 rounded-[24px] bg-white p-8 text-center shadow-sm">
              <h2 className="text-lg font-bold text-[#0A1628]">
                퀴즈를 시작할 수 없습니다
              </h2>

              <p className="mt-3 text-sm text-[#8A9BB0]">{errorMessage}</p>
            </article>
          )}

          {firstQuiz && (
            <article className="mt-7 rounded-[24px] bg-white px-20 py-10 shadow-sm">
              <h2 className="text-xl font-bold text-[#0A1628]">
                {firstQuiz.question}
              </h2>

              <div className="mt-7 space-y-4">
                {getOptions(firstQuiz).map((option, index) => {
                  const optionNumber = index + 1;
                  const isSelected = selectedOption === optionNumber;
                  const isCorrectOption =
                    isSubmitted && correctOption === optionNumber;
                  const isWrongSelected =
                    isSubmitted && isWrong && isSelected;

                  return (
                    <button
                      key={`${firstQuiz.quizId}-${optionNumber}`}
                      type="button"
                      disabled={isSubmitted}
                      onClick={() =>
                        handleSelectOption(firstQuiz.quizId, optionNumber)
                      }
                      className={`flex h-16 w-full items-center gap-4 rounded-[18px] border px-5 text-left text-[16px] font-bold transition ${
                        isCorrectOption
                          ? "border-[#6BCB77] bg-[#F1FFF4] text-[#478B4E]"
                          : isWrongSelected
                            ? "border-[#F06A6A] bg-[#FFF1F1] text-[#D94444]"
                            : isSelected
                              ? "border-[#6D9F9B] bg-[#EEF6FF] text-[#243247]"
                              : "border-[#E4EAF1] bg-white text-[#243247] hover:border-[#8AB9B7]"
                      } disabled:cursor-default`}
                    >
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#EFF7FF] text-sm font-bold text-[#6D9F9B]">
                        {optionLabels[index]}
                      </span>
                      {option}
                    </button>
                  );
                })}
              </div>

              {isSubmitted && isCorrect && (
                <div className="mt-5 rounded-[16px] bg-[#EFFAF2] py-3 text-center text-sm font-bold text-[#4BA45A]">
                  정답입니다!
                </div>
              )}

              {isSubmitted && isWrong && firstQuiz && (
                <div className="mt-5 rounded-[16px] bg-[#FFF1F1] py-3 text-center text-sm font-bold text-[#D94444]">
                  오답! 정답은 &quot;
                  {getOptions(firstQuiz)[(correctOption ?? 1) - 1]}
                  &quot;입니다.
                </div>
              )}

              {!isSubmitted && errorMessage && (
                <div className="mt-5 rounded-[16px] bg-red-50 py-3 text-center text-sm font-bold text-red-500">
                  {errorMessage}
                </div>
              )}

              <button
                type="button"
                disabled={isSubmitting}
                onClick={isSubmitted ? handleComplete : handleSubmit}
                className="mt-7 h-16 w-full rounded-[18px] bg-[#6D9F9B] text-[17px] font-bold text-white transition hover:bg-[#5E908D] disabled:opacity-60"
              >
                {isSubmitting ? "제출 중..." : isSubmitted ? "✓ 완료" : "제출하기"}
              </button>
            </article>
          )}
        </div>
      </section>
    </main>
  );
}