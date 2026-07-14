"use client";

import AdminErrorBanner from "@/features/common/components/AdminErrorBanner";
import { createQuizAction } from "@/features/contentmanage/quiz/actions";
import { FormEvent, useRef, useState } from "react";

type LectureQuizFormProps = {
  courseId: number;
  onPrev: () => void;
  onSubmit: () => void;
};

const labels = ["A", "B", "C", "D"];

type LectureQuizFieldErrors = {
  courseId: string;
  question: string;
  options: string[];
  correctOption: string;
};

const emptyFieldErrors = (): LectureQuizFieldErrors => ({
  courseId: "",
  question: "",
  options: ["", "", "", ""],
  correctOption: "",
});

export default function LectureQuizForm({
  courseId,
  onPrev,
  onSubmit,
}: LectureQuizFormProps) {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correctOption, setCorrectOption] = useState(1);
  const [explanation, setExplanation] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const submitLockRef = useRef(false);
  const [fieldErrors, setFieldErrors] = useState<LectureQuizFieldErrors>(
    emptyFieldErrors
  );

  const handleOptionChange = (index: number, value: string) => {
    setOptions((prev) =>
      prev.map((option, optionIndex) =>
        optionIndex === index ? value : option
      )
    );
    setFieldErrors((prev) => ({
      ...prev,
      options: prev.options.map((error, optionIndex) =>
        optionIndex === index ? "" : error
      ),
    }));
  };

  const validateForm = () => {
    const nextErrors = emptyFieldErrors();
    let hasError = false;

    if (!courseId) {
      nextErrors.courseId =
        "강의 ID를 찾을 수 없습니다. 강의 기본 정보를 먼저 등록해주세요.";
      hasError = true;
    }

    if (!question.trim()) {
      nextErrors.question = "퀴즈 문제를 입력해주세요.";
      hasError = true;
    }

    nextErrors.options = options.map((option) =>
      option.trim() ? "" : "보기를 입력해주세요."
    );
    hasError = hasError || nextErrors.options.some(Boolean);

    if (!nextErrors.options.some(Boolean)) {
      const optionCounts = options.reduce<Record<string, number[]>>(
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
          nextErrors.options[index] =
            "같은 보기는 중복해서 입력할 수 없습니다.";
          hasError = true;
        });
      });
    }

    if (correctOption < 1 || correctOption > 4) {
      nextErrors.correctOption = "정답은 1번부터 4번 중 선택해야 합니다.";
      hasError = true;
    }

    setFieldErrors(nextErrors);
    if (hasError) return false;

    setErrorMessage("");
    return true;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (submitLockRef.current) return;
    if (!validateForm()) return;
    submitLockRef.current = true;

    try {
      setIsSubmitting(true);
      await createQuizAction({
        courseId,
        question: question.trim(),
        option1: options[0].trim(),
        option2: options[1].trim(),
        option3: options[2].trim(),
        option4: options[3].trim(),
        correctOption,
        explanation: explanation.trim(),
      });
      onSubmit();
    } catch (error: unknown) {
      setErrorMessage(
        error instanceof Error ? error.message : "퀴즈 등록에 실패했습니다."
      );
    } finally {
      submitLockRef.current = false;
      setIsSubmitting(false);
    }
  };

  return (
    <form
      aria-labelledby="lecture-quiz-form-title"
      className="rounded-[20px] border border-[#E4E7EC] bg-white p-6"
      onSubmit={handleSubmit}
    >
      <header>
        <h2
          id="lecture-quiz-form-title"
          className="text-[24px] font-bold text-[#111827]"
        >
          퀴즈 정보
        </h2>
        <p className="mt-1 text-[15px] text-[#98A2B3]">
          강의 수강 후 확인할 퀴즈를 등록합니다.
        </p>
      </header>

      <AdminErrorBanner message={errorMessage} className="mt-4" />

      <fieldset className="mt-6 space-y-7" disabled={isSubmitting}>
        <legend className="sr-only">퀴즈 정보 입력 영역</legend>
        {fieldErrors.courseId && (
          <p className="text-[13px] font-medium text-[#DC2626]">
            {fieldErrors.courseId}
          </p>
        )}

        <div>
          <label
            htmlFor="lecture-quiz-question"
            className="text-[15px] font-semibold text-[#111827]"
          >
            문제 *
          </label>
          <textarea
            id="lecture-quiz-question"
            value={question}
            onChange={(event) => {
              setQuestion(event.target.value);
              setFieldErrors((prev) => ({ ...prev, question: "" }));
            }}
            placeholder="퀴즈 문제를 입력하세요"
            aria-invalid={Boolean(fieldErrors.question)}
            aria-describedby={
              fieldErrors.question ? "lecture-quiz-question-error" : undefined
            }
            className={`mt-3 h-[120px] w-full resize-none rounded-[14px] border p-4 text-[15px] outline-none transition-colors ${
              fieldErrors.question
                ? "border-[#DC2626] bg-[#FEF2F2]"
                : "border-[#E4E7EC] focus:border-[#439A97]"
            }`}
          />
          {fieldErrors.question && (
            <p
              id="lecture-quiz-question-error"
              className="mt-2 text-[13px] font-medium text-[#DC2626]"
            >
              {fieldErrors.question}
            </p>
          )}
        </div>

        <fieldset>
          <legend className="text-[15px] font-semibold text-[#111827]">
            객관식 보기 *
          </legend>
          <div className="mt-4 space-y-3">
            {options.map((option, index) => {
              const optionNumber = index + 1;
              const isSelected = correctOption === optionNumber;

              return (
                <div key={labels[index]} className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setCorrectOption(optionNumber)}
                    aria-label={`${optionNumber}번 보기를 정답으로 선택`}
                    aria-pressed={isSelected}
                    className={`flex h-[34px] w-[34px] items-center justify-center rounded-full text-[13px] font-bold ${
                      isSelected
                        ? "bg-[#439A97] text-white"
                        : "bg-[#F2F4F7] text-[#667085]"
                    }`}
                  >
                    {labels[index]}
                  </button>
                  <label
                    htmlFor={`lecture-quiz-option-${optionNumber}`}
                    className="sr-only"
                  >
                    {optionNumber}번 보기
                  </label>
                  <input
                    id={`lecture-quiz-option-${optionNumber}`}
                    type="text"
                    value={option}
                    onChange={(event) =>
                      handleOptionChange(index, event.target.value)
                    }
                    placeholder={`${optionNumber}번 보기`}
                    aria-invalid={Boolean(fieldErrors.options[index])}
                    aria-describedby={
                      fieldErrors.options[index]
                        ? `lecture-quiz-option-${optionNumber}-error`
                        : undefined
                    }
                    className={`h-[48px] flex-1 rounded-[14px] border px-4 text-[15px] outline-none transition-colors ${
                      fieldErrors.options[index]
                        ? "border-[#DC2626] bg-[#FEF2F2]"
                        : "border-[#E4E7EC] focus:border-[#439A97]"
                    }`}
                  />
                  {fieldErrors.options[index] && (
                    <p
                      id={`lecture-quiz-option-${optionNumber}-error`}
                      className="w-[128px] text-[13px] font-medium text-[#DC2626]"
                    >
                      {fieldErrors.options[index]}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
          {fieldErrors.correctOption && (
            <p className="mt-2 text-[13px] font-medium text-[#DC2626]">
              {fieldErrors.correctOption}
            </p>
          )}
          <p className="mt-3 text-[13px] text-[#98A2B3]">
            정답은 왼쪽 버튼으로 선택하세요.
          </p>
        </fieldset>

        <div>
          <label
            htmlFor="lecture-quiz-explanation"
            className="text-[15px] font-semibold text-[#111827]"
          >
            해설
          </label>
          <textarea
            id="lecture-quiz-explanation"
            value={explanation}
            onChange={(event) => setExplanation(event.target.value)}
            placeholder="정답 힌트나 해설을 입력하세요"
            className="mt-3 h-[100px] w-full resize-none rounded-[14px] border border-[#E4E7EC] p-4 text-[15px] outline-none focus:border-[#439A97]"
          />
        </div>
      </fieldset>

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
          type="submit"
          disabled={isSubmitting}
          className="h-[48px] rounded-[14px] bg-[#439A97] px-6 text-[15px] font-semibold text-white hover:opacity-90 disabled:cursor-not-allowed disabled:bg-[#CFE5E4]"
        >
          {isSubmitting ? "퀴즈 등록 중..." : "퀴즈 등록 및 완료"}
        </button>
      </footer>
    </form>
  );
}
