"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import QuizExplanationModal from "./QuizExplanationModal";
import type { CourseQuizAttempt, CourseQuizSubmitResult } from "../types";
import { useCourseCompletion } from "@/features/classroom/completion/hooks/useCourseCompletion";

interface QuizResultContentProps {
  courseId: string;
  result: CourseQuizSubmitResult;
  attempt: CourseQuizAttempt | null;
  onReview: () => void;
  onClose: () => void;
}

export default function QuizResultContent({
  courseId,
  result,
  attempt,
  onReview,
  onClose,
}: QuizResultContentProps) {
  const completion = useCourseCompletion(courseId);

  // 자동 수료 요청이 중복 실행되지 않도록 막는 ref
  const didRequestCompletion = useRef(false);

  // 해설 모달 상태
  const [isExplanationOpen, setIsExplanationOpen] = useState(false);

  // 퀴즈 제출 결과 화면에 들어오면 자동으로 수료 처리
  useEffect(() => {
    if (
      didRequestCompletion.current ||
      completion.status !== "idle"
    ) {
      return;
    }

    didRequestCompletion.current = true;
    completion.handleComplete();
  }, [completion.status, completion.handleComplete]);

  // 점수를 0~100으로 제한
  const score = Math.min(Math.max(result.score, 0), 100);

  const certificateHref = `/mypage/coursedetails/${courseId}/certificate`;

  return (
    <>
      <div className="flex w-full max-w-[550px] flex-col items-center text-center">
        {/* 수료 상태 */}
        <div
          className={`w-full rounded-[16px] border px-4 py-2 text-left ${
            completion.isCompleted
              ? "border-[#BDE4CA] bg-[#EFFAF2]"
              : completion.status === "failed"
                ? "border-[#F2C6C6] bg-[#FFF1F1]"
                : "border-[#CFE2E1] bg-[#F1F8F8]"
          }`}
        >
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <strong
                className={`block text-sm ${
                  completion.status === "failed"
                    ? "text-[#C84444]"
                    : "text-[#367C47]"
                }`}
              >
                {completion.isCompleted
                  ? "강의 수료 완료"
                  : completion.status === "failed"
                    ? "수료 처리 실패"
                    : "수료 처리 중"}
              </strong>

              <p className="mt-0.5 text-xs leading-5 text-[#667085]">
                {completion.message ||
                  "퀴즈 제출 후 수료 완료와 보상이 자동으로 처리됩니다."}
              </p>
            </div>

            {!completion.isCompleted && completion.isProcessing ? (
              <span className="shrink-0 rounded-xl bg-[#5E9F9B] px-4 py-2 text-xs font-bold text-white">
                처리 중...
              </span>
            ) : null}
          </div>

          {completion.status === "failed" ? (
            <button
              type="button"
              disabled={completion.isProcessing}
              onClick={completion.handleComplete}
              className="mt-2 h-8 w-full rounded-xl bg-[#C84444] text-xs font-bold text-white disabled:opacity-60"
            >
              다시 수료 처리하기
            </button>
          ) : null}

          {completion.isCompleted ? (
            <div className="mt-2 flex gap-2">
              <Link
                href={certificateHref}
                className="flex h-8 flex-1 items-center justify-center rounded-xl bg-[#5E9F9B] text-xs font-bold text-white"
              >
                수료증 확인
              </Link>

              <Link
                href="/mypage/benefits"
                className="flex h-8 flex-1 items-center justify-center rounded-xl border border-[#8AB9B7] bg-white text-xs font-bold text-[#5E9F9B]"
              >
                쿠폰·마일리지 확인
              </Link>
            </div>
          ) : null}
        </div>

        {/* 완료 표시 */}
        <div className="mt-3 flex h-11 w-11 items-center justify-center rounded-full bg-[#EAF8F1] text-lg font-bold text-[#439A97]">
          ✓
        </div>

        <h2 className="mt-2 text-xl font-bold text-[#0A1628]">
          퀴즈 완료!
        </h2>

        <p className="mt-1 text-xs text-[#8A9BB0]">
          모든 문제의 제출과 채점이 완료되었습니다.
        </p>

        {/* 점수 정보 */}
        <div className="mt-3 w-full rounded-2xl bg-[#F5F7FB] px-5 py-3">
          <div className="grid grid-cols-[1fr_auto_1fr] items-center">
            <div>
              <p className="text-xs text-[#A1AEC0]">맞힌 문제</p>

              <strong className="mt-0.5 block text-2xl text-[#439A97]">
                {result.correctCount}
              </strong>
            </div>

            <div className="h-9 w-px bg-[#E1E7EF]" />

            <div>
              <p className="text-xs text-[#A1AEC0]">전체 문제</p>

              <strong className="mt-0.5 block text-2xl text-[#0A1628]">
                {result.totalCount}
              </strong>
            </div>
          </div>

          <div className="mt-3 border-t border-[#E1E7EF] pt-3">
            <div className="flex items-center gap-3">
              <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-[#E7ECF3]">
                <div
                  className="h-full rounded-full bg-[#439A97]"
                  style={{ width: `${score}%` }}
                />
              </div>

              <strong className="text-lg text-[#439A97]">
                {score}%
              </strong>
            </div>
          </div>
        </div>

        <p className="mt-2 text-xs leading-5 text-[#8A9BB0]">
          정답 수에 따라 마일리지가 지급됩니다.
        </p>

        {/* 해설 보기 */}
        <button
          type="button"
          disabled={!attempt}
          onClick={() => setIsExplanationOpen(true)}
          className="mt-3 h-10 w-full rounded-xl border border-[#8AB9B7] bg-white text-sm font-bold text-[#5E9F9B] disabled:cursor-not-allowed disabled:opacity-50"
        >
          해설 보기
        </button>

        {/* 후기 작성 */}
        <button
          type="button"
          onClick={onReview}
          className="mt-2 h-10 w-full rounded-xl bg-[#5E9F9B] text-sm font-bold text-white"
        >
          수강 후기 작성하기
        </button>

        {/* 강의 이동 */}
        <button
          type="button"
          onClick={onClose}
          className="mt-2 h-10 w-full rounded-xl border border-[#DCE5F0] bg-white text-sm font-bold text-[#243247]"
        >
          강의로 돌아가기
        </button>
      </div>

      {/* 해설 모달 */}
      <QuizExplanationModal
        open={isExplanationOpen}
        attempt={attempt}
        onClose={() => setIsExplanationOpen(false)}
      />
    </>
  );
}