"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import CourseLearningSidebar from "@/features/classroom/learning/components/CourseLearningSidebar";
import QuizResultContent from "@/features/classroom/quiz/components/QuizResultContent";
import ReviewModal from "@/features/classroom/review/ReviewModal";
import { useCourseCompletion } from "@/features/classroom/completion/hooks/useCourseCompletion";
import type { CourseQuizAttempt } from "@/features/classroom/quiz/types";
import type { CourseStudyChapter } from "@/features/services/courseStudy.service";
import { getCourseStudyDetail } from "@/features/services/courseStudy.service";

const getParam = (
  value: string | string[] | undefined
) => {
  if (!value) return "";

  return decodeURIComponent(
    Array.isArray(value) ? value[0] : value
  );
};

export default function QuizCompletePage() {
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
  const quizResultHref = `${quizHref}/complete`;
  const qnaHref = `${lectureHref}/qna`;

  const certificateHref =
    `/mypage/coursedetails/${courseId}/certificate`;

  // 서버 수료 상태
  const completion =
    useCourseCompletion(courseId);

  const [courseTitle, setCourseTitle] =
    useState("");

  const [chapters, setChapters] = useState<
    CourseStudyChapter[]
  >([]);

  const [attempt, setAttempt] =
    useState<CourseQuizAttempt | null>(null);

  const [isLoading, setIsLoading] =
    useState(true);

  const [errorMessage, setErrorMessage] =
    useState("");

  const [
    isReviewModalOpen,
    setIsReviewModalOpen,
  ] = useState(false);

  useEffect(() => {
    if (!courseId) {
      setErrorMessage(
        "강의 번호가 올바르지 않습니다."
      );
      setIsLoading(false);
      return;
    }

    let active = true;

    const loadPage = async () => {
      try {
        setIsLoading(true);
        setErrorMessage("");

        // 저장된 퀴즈 결과 조회
        const storedAttempt =
          sessionStorage.getItem(
            `quiz-attempt-${courseId}`
          );

        if (storedAttempt) {
          try {
            const parsedAttempt = JSON.parse(
              storedAttempt
            ) as CourseQuizAttempt;

            if (active) {
              setAttempt(parsedAttempt);
            }
          } catch (error) {
            console.error(
              "[quiz-complete] 응시 결과 파싱 실패:",
              error
            );

            if (active) {
              setErrorMessage(
                "저장된 퀴즈 결과를 읽을 수 없습니다."
              );
            }
          }
        }

        // 강의 정보 조회
        const course =
          await getCourseStudyDetail(courseId);

        if (!active) return;

        setCourseTitle(course.title);

        setChapters(
          [...course.chapters].sort(
            (a, b) =>
              a.chapterOrder - b.chapterOrder
          )
        );
      } catch (error) {
        if (!active) return;

        console.error(
          "[quiz-complete] 결과 페이지 조회 실패:",
          error
        );

        setErrorMessage(
          error instanceof Error
            ? error.message
            : "퀴즈 결과 페이지를 불러오지 못했습니다."
        );
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    };

    loadPage();

    return () => {
      active = false;
    };
  }, [courseId]);

  if (isLoading) {
    return (
      <main className="flex h-[calc(100dvh-64px)] items-center justify-center overflow-hidden bg-[#F5F7FB]">
        <p className="text-sm text-[#8A9BB0]">
          퀴즈 결과를 불러오는 중입니다.
        </p>
      </main>
    );
  }

  return (
    <>
      <main className="flex h-[calc(100dvh-64px)] min-h-0 overflow-hidden bg-[#F5F7FB]">
        <CourseLearningSidebar
          courseTitle={courseTitle || "강의"}
          chapters={chapters}
          quizAvailable
          courseCompleted={completion.isCompleted}
          mode="complete"
          lectureHref={lectureHref}
          studyHref={studyHref}
          quizHref={quizHref}
          quizResultHref={quizResultHref}
          certificateHref={certificateHref}
          qnaHref={qnaHref}
          onChapterSelect={() =>
            router.push(studyHref)
          }
        />

        <section className="flex min-h-0 min-w-0 flex-1 p-3">
          <div className="mx-auto flex min-h-0 w-full max-w-[820px] flex-col">
            <header className="shrink-0 rounded-[18px] border border-[#E8EEF5] bg-white px-5 py-3 shadow-sm">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#EAF8F1] font-bold text-[#2F9E6F]">
                  ✓
                </span>

                <div>
                  <h1 className="text-base font-bold text-[#0A1628]">
                    퀴즈 결과
                  </h1>

                  <p className="mt-0.5 text-xs text-[#8A9BB0]">
                    퀴즈 제출과 채점이 완료되었습니다.
                  </p>
                </div>
              </div>
            </header>

            <section className="mt-3 flex min-h-0 flex-1 items-center justify-center overflow-hidden rounded-[20px] border border-[#E8EEF5] bg-white px-6 py-3 shadow-sm">
              {!attempt ? (
                <div className="text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#FFF4E5] font-bold text-[#D98A16]">
                    !
                  </div>

                  <h2 className="mt-4 text-lg font-bold text-[#0A1628]">
                    저장된 퀴즈 결과가 없습니다
                  </h2>

                  <p className="mt-2 text-sm text-[#8A9BB0]">
                    {errorMessage ||
                      "퀴즈를 제출한 후 결과를 확인해 주세요."}
                  </p>

                  <div className="mt-5 flex justify-center gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        router.replace(quizHref)
                      }
                      className="h-10 rounded-[14px] border border-[#DCE5F0] px-5 text-sm font-bold text-[#243247]"
                    >
                      퀴즈로 돌아가기
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        router.replace(studyHref)
                      }
                      className="h-10 rounded-[14px] bg-[#5E9F9B] px-5 text-sm font-bold text-white"
                    >
                      강의로 돌아가기
                    </button>
                  </div>
                </div>
              ) : (
                <QuizResultContent
                  courseId={courseId}
                  result={attempt.result}
                  attempt={attempt}
                  onReview={() =>
                    setIsReviewModalOpen(true)
                  }
                  onClose={() =>
                    router.replace(studyHref)
                  }
                />
              )}
            </section>
          </div>
        </section>
      </main>

      <ReviewModal
        open={isReviewModalOpen}
        courseId={courseId}
        onClose={() =>
          setIsReviewModalOpen(false)
        }
        onSuccess={(review) => {
          setIsReviewModalOpen(false);

          console.log(
            "[review] 등록된 후기:",
            review
          );

          window.dispatchEvent(
            new CustomEvent(
              "course-review-created",
              {
                detail: review,
              }
            )
          );

          window.alert(
            "수강 후기가 등록되었습니다."
          );
        }}
      />
    </>
  );
}