"use client";

import { useState } from "react";
import Link from "next/link";
import QuizExplanationModal from "./QuizExplanationModal";
import type { CourseQuizAttempt, CourseQuizSavedResult } from "../types";

interface QuizResultContentProps {
  courseId: string;
  result: CourseQuizSavedResult;
  attempt: CourseQuizAttempt | null;
  reviewWritten: boolean;
  reviewHref: string;
  onReview: () => void;
  onClose: () => void;
}

export default function QuizResultContent({
  courseId,
  result,
  attempt,
  reviewWritten,
  reviewHref,
  onReview,
  onClose,
}: QuizResultContentProps) {
  const [isExplanationOpen, setIsExplanationOpen] = useState(false);

  const score = Math.min(Math.max(result.score, 0), 100);
  const certificateHref = `/mypage/coursedetails/${courseId}/certificate`;
  const canShowExplanation = Boolean(attempt?.result.answers.length);

  return (
    <>
      <div className="mx-auto flex w-full max-w-[550px] flex-col items-center text-center">
        <div className="w-full rounded-[16px] border border-[#BDE4CA] bg-[#EFFAF2] px-4 py-3 text-left">
          <strong className="block text-sm text-[#367C47]">
            강의 수료 완료
          </strong>

          <p className="mt-1 text-xs leading-5 text-[#667085]">
            퀴즈 제출과 강의 수료가 완료되었습니다. 보상은 자동 지급됩니다.
          </p>

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
        </div>

        <div className="mt-3 flex h-11 w-11 items-center justify-center rounded-full bg-[#EAF8F1] text-lg font-bold text-[#439A97]">
          ✓
        </div>

        <h2 className="mt-2 text-xl font-bold text-[#0A1628]">
          퀴즈 완료!
        </h2>

        <p className="mt-1 text-xs text-[#8A9BB0]">
          퀴즈 제출과 채점이 완료되었습니다.
        </p>

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

              <strong className="text-lg text-[#439A97]">{score}%</strong>
            </div>
          </div>
        </div>

        <button
          type="button"
          disabled={!canShowExplanation}
          onClick={() => setIsExplanationOpen(true)}
          className="mt-3 h-10 w-full rounded-xl border border-[#8AB9B7] bg-white text-sm font-bold text-[#5E9F9B] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {canShowExplanation ? "해설 보기" : "해설 정보 없음"}
        </button>

        {reviewWritten ? (
          <Link
            href={reviewHref}
            className="mt-2 flex h-10 w-full items-center justify-center rounded-xl bg-[#5E9F9B] text-sm font-bold text-white"
          >
            수강 후기 보기
          </Link>
        ) : (
          <button
            type="button"
            onClick={onReview}
            className="mt-2 h-10 w-full rounded-xl bg-[#5E9F9B] text-sm font-bold text-white"
          >
            수강 후기 작성하기
          </button>
        )}

        <button
          type="button"
          onClick={onClose}
          className="mt-2 h-10 w-full rounded-xl border border-[#DCE5F0] bg-white text-sm font-bold text-[#243247]"
        >
          강의로 돌아가기
        </button>
      </div>

      <QuizExplanationModal
        open={isExplanationOpen}
        attempt={attempt}
        onClose={() => setIsExplanationOpen(false)}
      />
    </>
  );
}