"use client";

import { useEffect, useState } from "react";
import { ApiRequestError } from "@/lib/api";
import { createCourseReview, CourseReview } from "@/features/services/courseReview.service";

interface ReviewModalProps {
  open: boolean;
  courseId: string;
  onClose: () => void;
  onSuccess?: (review: CourseReview) => void;
}

const getErrorCode = (error: ApiRequestError) => {
  const body = error.body as {
    code?: string;
    errorCode?: string;
  } | null;

  return error.code || body?.errorCode || body?.code || "";
};

export default function ReviewModal({
  open,
  courseId,
  onClose,
  onSuccess,
}: ReviewModalProps) {
  const [rating, setRating] = useState(0);
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] =
    useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const isValid =
    rating >= 1 &&
    rating <= 5 &&
    content.trim().length > 0;

  useEffect(() => {
    if (!open) return;

    setRating(0);
    setContent("");
    setErrorMessage("");

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener(
        "keydown",
        handleEscape
      );
    };
  }, [open, onClose]);

  if (!open) return null;

  const handleSubmit = async () => {
    if (!isValid || isSubmitting) return;

    try {
      setIsSubmitting(true);
      setErrorMessage("");

      const review = await createCourseReview(
        courseId,
        { rating, content }
      );

      onSuccess?.(review);
      onClose();
    } catch (error) {
      console.error("[review] 후기 등록 실패:", error);

      if (error instanceof ApiRequestError) {
        const code = getErrorCode(error);

        if (
          error.status === 409 ||
          code === "LMS_026" ||
          code === "REVIEW_ALREADY_EXISTS"
        ) {
          setErrorMessage(
            "이미 해당 강의에 후기를 작성했습니다."
          );
          return;
        }

        if (
          error.status === 403 ||
          code === "COURSE_NOT_COMPLETED"
        ) {
          setErrorMessage(
            "강의를 수료한 후 후기를 작성할 수 있습니다."
          );
          return;
        }

        if (error.status === 401) {
          setErrorMessage(
            "로그인 후 후기를 작성할 수 있습니다."
          );
          return;
        }

        if (error.status === 404) {
          setErrorMessage(
            "해당 강의를 찾을 수 없습니다."
          );
          return;
        }

        setErrorMessage(error.message);
        return;
      }

      setErrorMessage(
        error instanceof Error
          ? error.message
          : "후기 등록에 실패했습니다."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 px-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="review-title"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <section className="w-full max-w-[540px] rounded-[24px] bg-white px-7 py-6 shadow-xl">
        <header className="flex justify-between gap-4">
          <div>
            <h2
              id="review-title"
              className="text-xl font-bold text-[#0A1628]"
            >
              수강 후기 작성
            </h2>

            <p className="mt-1.5 text-sm text-[#8A9BB0]">
              수료한 강의에 대한 후기를 남겨주세요.
              후기 작성은 선택 사항입니다.
            </p>
          </div>

          <button
            type="button"
            disabled={isSubmitting}
            onClick={onClose}
            aria-label="후기 창 닫기"
            className="text-2xl text-[#98A2B3]"
          >
            ×
          </button>
        </header>

        <fieldset className="mt-6">
          <legend className="text-sm font-bold text-[#0A1628]">
            평점
          </legend>

          <div className="mt-2 flex gap-1">
            {[1, 2, 3, 4, 5].map((value) => (
              <button
                key={value}
                type="button"
                disabled={isSubmitting}
                onClick={() => {
                  setRating(value);
                  setErrorMessage("");
                }}
                aria-label={`${value}점`}
                aria-pressed={rating === value}
                className={`text-4xl ${
                  value <= rating
                    ? "text-[#E5A12E]"
                    : "text-[#E5EAF0]"
                }`}
              >
                ★
              </button>
            ))}
          </div>
        </fieldset>

        <div className="mt-5">
          <label
            htmlFor="review-content"
            className="text-sm font-bold text-[#0A1628]"
          >
            후기 내용
          </label>

          <textarea
            id="review-content"
            required
            value={content}
            disabled={isSubmitting}
            onChange={(event) => {
              setContent(event.target.value);
              setErrorMessage("");
            }}
            placeholder="강의에 대한 솔직한 후기를 작성해 주세요."
            className="mt-2 min-h-36 w-full resize-y rounded-[16px] border border-[#DCE5F0] px-4 py-3 text-sm text-[#243247] outline-none focus:border-[#6D9F9B]"
          />
        </div>

        {errorMessage ? (
          <p
            role="alert"
            className="mt-3 rounded-[14px] bg-red-50 px-4 py-3 text-sm font-bold text-red-500"
          >
            {errorMessage}
          </p>
        ) : null}

        <div className="mt-5 grid grid-cols-2 gap-3">
          <button
            type="button"
            disabled={isSubmitting}
            onClick={onClose}
            className="h-12 rounded-[16px] border border-[#DCE5F0] font-bold text-[#243247]"
          >
            취소
          </button>

          <button
            type="button"
            disabled={!isValid || isSubmitting}
            onClick={handleSubmit}
            className="h-12 rounded-[16px] bg-[#5E9F9B] font-bold text-white disabled:bg-[#BDD7D5]"
          >
            {isSubmitting ? "등록 중..." : "등록하기"}
          </button>
        </div>
      </section>
    </div>
  );
}