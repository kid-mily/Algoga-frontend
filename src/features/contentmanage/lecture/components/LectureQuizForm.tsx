"use client";

import AdminErrorBanner from "@/features/common/components/AdminErrorBanner";
import { useState } from "react";
import { createQuizAction } from "@/features/contentmanage/quiz/actions";
import QuizDraftItem from "@/features/contentmanage/quiz/components/QuizDraftItem";
import {
  LectureQuizDraft,
  LectureQuizDraftErrors,
  MAX_QUIZ_COUNT,
} from "@/features/contentmanage/quiz/types";

type LectureQuizFormProps = {
  courseId: number;
  onPrev: () => void;
  onSubmit: () => void | Promise<void>;
};

const createDraft = (id: number): LectureQuizDraft => ({
  id,
  question: "",
  options: ["", "", "", ""],
  correctOption: 1,
  explanation: "",
});

export default function LectureQuizForm({
  courseId,
  onPrev,
  onSubmit,
}: LectureQuizFormProps) {
  const [quizzes, setQuizzes] = useState<LectureQuizDraft[]>([createDraft(1)]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [globalError, setGlobalError] = useState("");
  const [quizErrors, setQuizErrors] = useState<Record<number, LectureQuizDraftErrors>>({});
  const [areQuizzesSaved, setAreQuizzesSaved] = useState(false);

  const handleAddQuiz = () => {
    if (quizzes.length >= MAX_QUIZ_COUNT) {
      setGlobalError(`퀴즈는 최대 ${MAX_QUIZ_COUNT}개까지 등록할 수 있습니다.`);
      return;
    }
    setQuizzes((prev) => [...prev, createDraft(prev.length + 1)]);
  };

  const handleRemoveQuiz = (id: number) => {
    setQuizzes((prev) =>
      prev
        .filter((quiz) => quiz.id !== id)
        .map((quiz, index) => ({ ...quiz, id: index + 1 }))
    );
    setQuizErrors((prev) => {
      const nextErrors = { ...prev };
      delete nextErrors[id];
      return nextErrors;
    });
  };

  const updateQuiz = (id: number, patch: Partial<LectureQuizDraft>) => {
    setQuizzes((prev) =>
      prev.map((quiz) => (quiz.id === id ? { ...quiz, ...patch } : quiz))
    );
  };

  const clearQuizError = (id: number, patch: Partial<LectureQuizDraftErrors>) => {
    setQuizErrors((prev) => ({ ...prev, [id]: { ...prev[id], ...patch } }));
  };

  const validateQuizzes = () => {
    setGlobalError("");

    if (!courseId) {
      setGlobalError("강의 ID를 찾을 수 없습니다. 강의 기본 정보를 먼저 등록해주세요.");
      return false;
    }

    const newErrors: Record<number, LectureQuizDraftErrors> = {};
    let hasError = false;

    for (const quiz of quizzes) {
      const errors: LectureQuizDraftErrors = {};

      if (!quiz.question.trim()) {
        errors.question = "퀴즈 문제를 입력해주세요.";
        hasError = true;
      }

      const optionErrors: string[] = quiz.options.map((option) =>
        option.trim() ? "" : "보기를 입력해주세요."
      );
      const optionCounts = quiz.options.reduce<Record<string, number[]>>(
        (counts, option, index) => {
          const key = option.trim();
          counts[key] = [...(counts[key] ?? []), index];
          return counts;
        },
        {}
      );

      Object.values(optionCounts).forEach((indexes) => {
        if (indexes.length <= 1) return;
        indexes.forEach((index) => {
          if (quiz.options[index].trim()) {
            optionErrors[index] = "같은 보기는 중복해서 입력할 수 없습니다.";
          }
        });
      });

      if (optionErrors.some(Boolean)) {
        errors.options = optionErrors;
        hasError = true;
      }

      if (quiz.correctOption < 1 || quiz.correctOption > 4) {
        errors.correctOption = "정답은 1번부터 4번 중 선택해야 합니다.";
        hasError = true;
      }

      if (Object.keys(errors).length > 0) newErrors[quiz.id] = errors;
    }

    if (hasError) {
      setQuizErrors(newErrors);
      return false;
    }

    setQuizErrors({});
    return true;
  };

  const handleSubmit = async () => {
    if (!areQuizzesSaved && !validateQuizzes()) return;

    try {
      setIsSubmitting(true);
      if (!areQuizzesSaved) {
        for (const quiz of quizzes) {
          await createQuizAction({
            courseId,
            question: quiz.question.trim(),
            option1: quiz.options[0].trim(),
            option2: quiz.options[1].trim(),
            option3: quiz.options[2].trim(),
            option4: quiz.options[3].trim(),
            correctOption: quiz.correctOption,
            explanation: quiz.explanation.trim(),
          });
        }
        setAreQuizzesSaved(true);
      }
      await onSubmit();
    } catch (error: unknown) {
      setGlobalError(error instanceof Error ? error.message : "퀴즈 등록에 실패했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      aria-labelledby="lecture-quiz-form-title"
      className="rounded-[20px] border border-[#E4E7EC] bg-white p-6"
    >
      <header className="flex items-center justify-between">
        <div>
          <h2 id="lecture-quiz-form-title" className="text-[24px] font-bold text-[#111827]">
            퀴즈 정보
          </h2>
          <p className="mt-1 text-[15px] text-[#98A2B3]">
            강의 수강 후 확인할 퀴즈를 등록합니다.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-[14px] font-semibold text-[#667085]">
            퀴즈 {quizzes.length} / {MAX_QUIZ_COUNT}
          </span>
          <button
            type="button"
            onClick={handleAddQuiz}
            disabled={isSubmitting || quizzes.length >= MAX_QUIZ_COUNT}
            className="h-[44px] rounded-full bg-[#439A97] px-5 text-[14px] font-semibold text-white disabled:cursor-not-allowed disabled:bg-[#CFE5E4]"
          >
            퀴즈 추가
          </button>
        </div>
      </header>

      <AdminErrorBanner message={globalError} className="mt-4" />

      <div className="mt-6 space-y-4">
        {quizzes.map((quiz, index) => (
          <QuizDraftItem
            key={quiz.id}
            index={index}
            question={quiz.question}
            options={quiz.options}
            correctOption={quiz.correctOption}
            explanation={quiz.explanation}
            errors={quizErrors[quiz.id]}
            onQuestionChange={(value) => {
              updateQuiz(quiz.id, { question: value });
              clearQuizError(quiz.id, { question: undefined });
            }}
            onOptionChange={(optionIndex, value) => {
              updateQuiz(quiz.id, {
                options: quiz.options.map((option, i) => (i === optionIndex ? value : option)),
              });
              clearQuizError(quiz.id, {
                options: quizErrors[quiz.id]?.options?.map((error, i) =>
                  i === optionIndex ? "" : error
                ),
              });
            }}
            onCorrectOptionChange={(optionNumber) =>
              updateQuiz(quiz.id, { correctOption: optionNumber })
            }
            onExplanationChange={(value) => updateQuiz(quiz.id, { explanation: value })}
            onRemove={quizzes.length > 1 ? () => handleRemoveQuiz(quiz.id) : undefined}
          />
        ))}
      </div>

      <footer className="mt-8 flex justify-between">
        <button
          type="button"
          onClick={onPrev}
          disabled={isSubmitting}
          className="h-[48px] rounded-[14px] border border-[#E4E7EC] px-6 text-[15px] font-semibold text-[#667085] hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          이전
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="h-[48px] rounded-[14px] bg-[#439A97] px-6 text-[15px] font-semibold text-white hover:opacity-90 disabled:cursor-not-allowed disabled:bg-[#CFE5E4]"
        >
          {isSubmitting ? "퀴즈 등록 중..." : "퀴즈 등록 및 완료"}
        </button>
      </footer>
    </section>
  );
}
