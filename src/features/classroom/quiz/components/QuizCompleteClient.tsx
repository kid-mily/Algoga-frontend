"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import CourseLearningSidebar from "@/features/classroom/learning/components/CourseLearningSidebar";
import QuizResultContent from "@/features/classroom/quiz/components/QuizResultContent";
import ReviewModal from "@/features/classroom/review/ReviewModal";
import type { QuizCompleteLoadResult } from "@/features/classroom/quiz/actions";
import { useCourseCompletionStatus } from "@/features/classroom/completion/hooks/useCourseCompletionStatus";

const getParam = (value: string | string[] | undefined) => {
  if (!value) return "";
  return decodeURIComponent(Array.isArray(value) ? value[0] : value);
};

interface QuizCompleteClientProps {
  // 서버(quiz/complete/page.tsx)에서 조회한 결과 — 저장된 결과가 없거나 조회에
  // 실패하면 null (클라이언트에서 재조회하지 않고 "결과 없음" 화면을 바로 보여준다)
  initialData: QuizCompleteLoadResult | null;
}

export default function QuizCompleteClient({
  initialData,
}: QuizCompleteClientProps) {
  const params = useParams();
  const router = useRouter();

  const continentCode = getParam(params.continentCode).toLowerCase();
  const countryId = getParam(params.countryid);
  const courseId = getParam(params.courseId);

  const lectureHref = `/classroom/${continentCode}/${countryId}/lecture/${courseId}`;
  const studyHref = `${lectureHref}/study`;
  const quizHref = `${lectureHref}/quiz`;
  const quizResultHref = `${quizHref}/complete`;
  const reviewHref = `${lectureHref}/review`;
  const qnaHref = `${lectureHref}/qna`;
  const certificateHref = `/mypage/coursedetails/${courseId}/certificate`;

  const completion = useCourseCompletionStatus(courseId);

  const courseTitle = initialData?.courseTitle ?? "";
  const chapters = initialData?.chapters ?? [];
  const attempt = initialData?.attempt ?? null;

  const [reviewWrittenOverride, setReviewWrittenOverride] = useState(false);
  const reviewWritten = completion.reviewWritten || reviewWrittenOverride;
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  return (
    <>
        <main className="flex min-h-[calc(100dvh-64px)] bg-[#F3F8FC]">
        <CourseLearningSidebar
            courseTitle={courseTitle || "강의"}
            chapters={chapters}
            quizAvailable
            quizSubmitted={attempt !== null || completion.isCompleted}
            courseCompleted={completion.isCompleted}
            mode="complete"
            lectureHref={lectureHref}
            studyHref={studyHref}
            quizHref={quizHref}
            quizResultHref={quizResultHref}
            certificateHref={certificateHref}
            qnaHref={qnaHref}
            onChapterSelect={() => router.push(studyHref)}
        />

        <section className="min-w-0 flex-1 overflow-y-auto px-5 py-6 lg:px-8">
            <div className="mx-auto w-full max-w-4xl">
            <header className="rounded-2xl border border-[#DDE8EF] bg-white px-6 py-5 shadow-[0_12px_32px_rgba(55,88,110,0.08)]">
                <p className="text-xs font-bold tracking-[0.22em] text-[#439A97]">
                QUIZ RESULT
                </p>

                <h1 className="mt-2 text-xl font-semibold text-[#0A1628]">
                퀴즈 결과
                </h1>

                <p className="mt-2 text-sm text-[#718096]">
                퀴즈 제출과 채점이 완료되었습니다.
                </p>
            </header>

            <section className="mt-4 rounded-2xl border border-[#E1E8EF] bg-white px-5 py-6 shadow-[0_8px_24px_rgba(55,88,110,0.07)] sm:px-6">
                {!attempt ? (
                <div className="py-16 text-center">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#FFF4E8] font-bold text-[#A87512]">
                    !
                    </div>

                    <h2 className="mt-4 text-lg font-bold text-[#0A1628]">
                    저장된 퀴즈 결과가 없습니다.
                    </h2>

                    <p className="mt-2 text-sm text-[#8A94A6]">
                    퀴즈를 제출한 뒤 결과를 확인해 주세요.
                    </p>

                    <div className="mt-5 flex justify-center gap-2">
                    <button
                        type="button"
                        onClick={() => router.replace(quizHref)}
                        className="h-10 rounded-2xl border border-[#DCE5F0] px-5 text-sm font-bold text-[#243247]"
                    >
                        퀴즈로 돌아가기
                    </button>

                    <button
                        type="button"
                        onClick={() => router.replace(studyHref)}
                        className="h-10 rounded-2xl bg-[#439A97] px-5 text-sm font-bold text-white"
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
                    reviewWritten={reviewWritten}
                    reviewHref={reviewHref}
                    onReview={() => setIsReviewModalOpen(true)}
                    onClose={() => router.replace(studyHref)}
                />
                )}
            </section>
            </div>
        </section>
        </main>

        <ReviewModal
        open={isReviewModalOpen}
        courseId={courseId}
        onClose={() => setIsReviewModalOpen(false)}
        onSuccess={(review) => {
            setIsReviewModalOpen(false);
            setReviewWrittenOverride(true);

            window.dispatchEvent(
            new CustomEvent("course-review-created", {
                detail: review,
            })
            );

            window.alert("수강 후기가 등록되었습니다.");
        }}
        />
    </>
    );
}