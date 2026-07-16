"use client";

import AdminErrorBanner from "@/features/common/components/AdminErrorBanner";
import CharCounter from "@/features/common/components/CharCounter";
import { FormEvent, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import CompleteModal from "@/features/common/components/CompleteModal";
import Modal from "@/features/common/components/Modal";
import { getLectureListAction } from "@/features/contentmanage/lecture/actions";
import { AdminCourse } from "@/features/contentmanage/lecture/types";
import { createQuizAction, updateQuizAction } from "../actions";
import { QuizFormProps } from "../types";

const QUIZ_QUESTION_MAX_LENGTH = 500;
const QUIZ_OPTION_MAX_LENGTH = 200;
const QUIZ_EXPLANATION_MAX_LENGTH = 1000;

const emptyQuiz = {
  courseId: 0,
  question: "",
  option1: "",
  option2: "",
  option3: "",
  option4: "",
  correctOption: 1,
  explanation: "",
};

const createEmptyOptionErrors = () => ["", "", "", ""];

export default function QuizForm({
  mode = "create",
  initialQuiz = emptyQuiz,
  defaultCourseId,
}: QuizFormProps) {
  const router = useRouter();
  const [courses, setCourses] = useState<AdminCourse[]>([]);
  const [courseId, setCourseId] = useState<number>(
    mode === "create"
      ? defaultCourseId ?? initialQuiz.courseId ?? 0
      : initialQuiz.courseId ?? 0
  );
  const [question, setQuestion] = useState(initialQuiz.question);
  const [options, setOptions] = useState<string[]>([
    initialQuiz.option1,
    initialQuiz.option2,
    initialQuiz.option3,
    initialQuiz.option4,
  ]);
  const [correctOption, setCorrectOption] = useState<number>(initialQuiz.correctOption);
  const [explanation, setExplanation] = useState(initialQuiz.explanation);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openCompleteModal, setOpenCompleteModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [optionErrors, setOptionErrors] = useState<string[]>(createEmptyOptionErrors);
  const submitLockRef = useRef(false);

  const labels = ["A", "B", "C", "D"];
  const isCreateMode = mode === "create";

  useEffect(() => {
    if (isCreateMode && defaultCourseId) {
      setCourseId(defaultCourseId);
    }
  }, [defaultCourseId, isCreateMode]);

  useEffect(() => {
    const controller = new AbortController();

    const fetchCourses = async () => {
      try {
        const courseList = await getLectureListAction(controller.signal);
        if (controller.signal.aborted) return;
        setCourses(courseList);
      } catch (error: unknown) {
        if (error instanceof DOMException && error.name === "AbortError") return;
        if (controller.signal.aborted) return;
        setErrorMessage(error instanceof Error ? error.message : "강의 목록을 불러오지 못했습니다.");
      }
    };

    void fetchCourses();

    return () => {
      controller.abort();
    };
  }, []);

  const handleOptionChange = (index: number, value: string) => {
    const updated = [...options];
    updated[index] = value;
    setOptions(updated);
    setOptionErrors((prev) =>
      prev.map((error, optionIndex) => (optionIndex === index ? "" : error))
    );
  };

  const validateForm = () => {
    const nextOptionErrors = createEmptyOptionErrors();
    let hasOptionError = false;

    if (!courseId) {
      setErrorMessage("강의를 선택해주세요.");
      return false;
    }

    if (!question.trim()) {
      setErrorMessage("퀴즈 문제를 입력해주세요.");
      return false;
    }

    if (options.some((option) => !option.trim())) {
      options.forEach((option, index) => {
        if (!option.trim()) {
          nextOptionErrors[index] = "보기를 입력해주세요.";
          hasOptionError = true;
        }
      });
      setOptionErrors(nextOptionErrors);
      setErrorMessage("");
      return false;
    }

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
        nextOptionErrors[index] = "같은 보기는 중복해서 입력할 수 없습니다.";
        hasOptionError = true;
      });
    });

    if (hasOptionError) {
      setOptionErrors(nextOptionErrors);
      setErrorMessage("");
      return false;
    }

    if (correctOption < 1 || correctOption > 4) {
      setErrorMessage("정답은 1번부터 4번 중 선택해야 합니다.");
      return false;
    }

    setErrorMessage("");
    setOptionErrors(createEmptyOptionErrors());
    return true;
  };

  const submitQuiz = async () => {
    if (submitLockRef.current) return;
    if (!validateForm()) return;
    submitLockRef.current = true;
    setIsSubmitting(true);

    const payload = {
      question: question.trim(),
      option1: options[0].trim(),
      option2: options[1].trim(),
      option3: options[2].trim(),
      option4: options[3].trim(),
      correctOption,
      explanation: explanation.trim(),
    };

    try {
      if (isCreateMode) {
        await createQuizAction({ courseId, ...payload });
      } else {
        if (!initialQuiz.quizId) {
          setErrorMessage("수정할 퀴즈 ID를 찾을 수 없습니다.");
          return;
        }

        await updateQuizAction(courseId, initialQuiz.quizId, payload);
      }

      setOpenCompleteModal(true);
    } catch (error: unknown) {
      setErrorMessage(error instanceof Error ? error.message : "퀴즈 저장에 실패했습니다.");
    } finally {
      submitLockRef.current = false;
      setIsSubmitting(false);
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isCreateMode) {
      void submitQuiz();
    } else {
      setOpenEditModal(true);
    }
  };

  return (
    <form
      aria-labelledby="quiz-form-title"
      className="mt-6 rounded-[24px] border border-[#E4E7EC] bg-white p-6"
      onSubmit={handleSubmit}
    >
      <h2 id="quiz-form-title" className="sr-only">
        {isCreateMode ? "퀴즈 등록 폼" : "퀴즈 수정 폼"}
      </h2>

      <fieldset className="space-y-7" disabled={isSubmitting}>
        <legend className="sr-only">퀴즈 정보</legend>

        <div>
          <label htmlFor="quiz-course" className="text-[15px] font-semibold text-[#111827]">
            강의 선택 <span className="text-[#D92D20]">*</span>
          </label>
          <select
            id="quiz-course"
            value={courseId || ""}
            onChange={(event) => setCourseId(Number(event.target.value))}
            disabled={!isCreateMode}
            className="mt-3 h-[48px] w-full rounded-[14px] border border-[#E4E7EC] px-4 text-[15px] outline-none disabled:bg-gray-100"
          >
            <option value="">강의를 선택해주세요</option>
            {courses.map((course) => (
              <option key={course.courseId} value={course.courseId}>
                {course.title}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="quiz-question" className="text-[15px] font-semibold text-[#111827]">
            문제 <span className="text-[#D92D20]">*</span>
          </label>
          <textarea
            id="quiz-question"
            value={question}
            onChange={(event) => setQuestion(event.target.value)}
            placeholder="퀴즈 문제를 입력하세요"
            maxLength={QUIZ_QUESTION_MAX_LENGTH}
            className="mt-3 h-[120px] w-full resize-none rounded-[14px] border border-[#E4E7EC] p-4 text-[15px] outline-none"
          />
          <div className="mt-1 flex justify-end">
            <CharCounter length={question.length} maxLength={QUIZ_QUESTION_MAX_LENGTH} />
          </div>
        </div>

        <fieldset>
          <legend className="text-[15px] font-semibold text-[#111827]">
            객관식 보기 <span className="text-[#D92D20]">*</span>
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
                      isSelected ? "bg-[#439A97] text-white" : "bg-[#F2F4F7] text-[#667085]"
                    }`}
                  >
                    {labels[index]}
                  </button>
                  <label htmlFor={`quiz-option-${optionNumber}`} className="sr-only">
                    {optionNumber}번 보기
                  </label>
                  <div className="flex-1">
                    <input
                      id={`quiz-option-${optionNumber}`}
                      type="text"
                      value={option}
                      onChange={(event) => handleOptionChange(index, event.target.value)}
                      placeholder={`${optionNumber}번 보기`}
                      maxLength={QUIZ_OPTION_MAX_LENGTH}
                      aria-invalid={Boolean(optionErrors[index])}
                      aria-describedby={
                        optionErrors[index]
                          ? `quiz-option-${optionNumber}-error`
                          : undefined
                      }
                      className={`h-[48px] w-full rounded-[14px] border px-4 text-[15px] outline-none ${
                        optionErrors[index]
                          ? "border-[#DC2626] bg-[#FEF2F2]"
                          : "border-[#E4E7EC]"
                      }`}
                    />
                    <div className="mt-1 flex items-center justify-between">
                      {optionErrors[index] ? (
                        <p
                          id={`quiz-option-${optionNumber}-error`}
                          className="text-[13px] font-medium text-[#DC2626]"
                        >
                          {optionErrors[index]}
                        </p>
                      ) : (
                        <span />
                      )}
                      <CharCounter length={option.length} maxLength={QUIZ_OPTION_MAX_LENGTH} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <p className="mt-3 text-[13px] text-[#98A2B3]">
            정답은 왼쪽 버튼으로 선택하세요.
          </p>
        </fieldset>

        <div>
          <label htmlFor="quiz-explanation" className="text-[15px] font-semibold text-[#111827]">
            해설
          </label>
          <textarea
            id="quiz-explanation"
            value={explanation}
            onChange={(event) => setExplanation(event.target.value)}
            placeholder="정답 힌트나 해설을 입력하세요"
            maxLength={QUIZ_EXPLANATION_MAX_LENGTH}
            className="mt-3 h-[100px] w-full resize-none rounded-[14px] border border-[#E4E7EC] p-4 text-[15px] outline-none"
          />
          <div className="mt-1 flex justify-end">
            <CharCounter length={explanation.length} maxLength={QUIZ_EXPLANATION_MAX_LENGTH} />
          </div>
        </div>
      </fieldset>

      <AdminErrorBanner message={errorMessage} className="mt-5" />

      <footer className="mt-8 flex items-center justify-end border-t border-[#E4E7EC] pt-6">
        <button
          type="submit"
          disabled={isSubmitting}
          className="h-[44px] rounded-[14px] bg-[#439A97] px-5 text-[14px] font-semibold text-white disabled:bg-[#CFE5E4]"
        >
          {isSubmitting ? "저장 중..." : isCreateMode ? "등록하기" : "수정하기"}
        </button>
      </footer>

      <Modal
        open={openEditModal}
        title="퀴즈 수정"
        description="퀴즈를 수정하시겠습니까?"
        confirmText="수정"
        cancelText="취소"
        confirmDisabled={isSubmitting}
        onConfirm={() => {
          setOpenEditModal(false);
          void submitQuiz();
        }}
        onCancel={() => setOpenEditModal(false)}
      />

      <CompleteModal
        open={openCompleteModal}
        title={isCreateMode ? "등록 완료" : "수정 완료"}
        description={isCreateMode ? "퀴즈가 등록되었습니다." : "퀴즈가 수정되었습니다."}
        buttonText="확인"
        onConfirm={() => {
          setOpenCompleteModal(false);
          router.push(
            courseId ? `/contentadmin/quiz?courseId=${courseId}` : "/contentadmin/quiz"
          );
        }}
      />
    </form>
  );
}
