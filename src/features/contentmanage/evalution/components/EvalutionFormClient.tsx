"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import AdminErrorBanner from "@/features/common/components/AdminErrorBanner";
import CompleteModal from "@/features/common/components/CompleteModal";
import Modal from "@/features/common/components/Modal";
import SubHeader from "@/features/common/components/SubHeader";
import type { CourseCountry } from "@/features/contentmanage/lecture/types";
import { getCourseCountries } from "@/features/services/adminCourse.service";
import {
  createEvalutionQuestion,
  deleteEvalutionQuestion,
  getEvalutionQuestion,
  getEvalutionQuestions,
  updateEvalutionQuestion,
} from "@/features/services/adminEvalution.service";
import { EvalutionQuestionFormData } from "../types";

type EvalutionFormClientProps = {
  mode: "create" | "edit";
  questionId?: number;
};

const QUESTION_COUNT = 5;
const OPTION_COUNT = 4;

const normalizeFourOptions = (options: string[]) => {
  const nextOptions = [...options.slice(0, OPTION_COUNT)];

  while (nextOptions.length < OPTION_COUNT) {
    nextOptions.push("");
  }

  return nextOptions;
};

const createEmptyQuestion = (
  order: number,
  country?: CourseCountry
): EvalutionQuestionFormData => ({
  countryId: country?.countryId ?? 0,
  questionOrder: order,
  country: country?.countryName ?? "",
  title: "",
  options: ["", "", "", ""],
  answerIndex: 0,
  explanation: "",
});

const createEmptySet = (country?: CourseCountry) =>
  Array.from({ length: QUESTION_COUNT }, (_, index) =>
    createEmptyQuestion(index + 1, country)
  );

export default function EvalutionFormClient({
  mode,
  questionId,
}: EvalutionFormClientProps) {
  const router = useRouter();
  const [questions, setQuestions] = useState<EvalutionQuestionFormData[]>(
    createEmptySet()
  );
  const [countries, setCountries] = useState<CourseCountry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [editConfirmOpen, setEditConfirmOpen] = useState(false);
  const [completeOpen, setCompleteOpen] = useState(false);
  const selectedCountryId = questions[0]?.countryId ?? 0;
  const selectedCountry = useMemo(
    () => countries.find((country) => country.countryId === selectedCountryId),
    [countries, selectedCountryId]
  );

  useEffect(() => {
    const controller = new AbortController();

    const load = async () => {
      try {
        setIsLoading(true);
        setError("");
        const countryList = await getCourseCountries(controller.signal);

        if (controller.signal.aborted) return;
        setCountries(countryList);

        if (mode === "edit" && questionId) {
          const baseQuestion = await getEvalutionQuestion(questionId, controller.signal);

          if (controller.signal.aborted) return;

          if (!baseQuestion) {
            setError("진단평가 문제를 찾을 수 없습니다.");
            return;
          }

          const country = countryList.find(
            (item) => item.countryId === baseQuestion.countryId
          );
          const loadedQuestions = await getEvalutionQuestions(
            baseQuestion.countryId,
            country?.countryName ?? baseQuestion.country,
            controller.signal
          );

          if (controller.signal.aborted) return;

          const sortedQuestions = [...loadedQuestions].sort(
            (a, b) => a.questionOrder - b.questionOrder
          );
          const nextQuestions = createEmptySet(country).map(
            (emptyQuestion, index) => {
              const question = sortedQuestions[index];

              if (!question) return emptyQuestion;

              return {
                id: question.id,
                countryId: question.countryId,
                questionOrder: index + 1,
                country: question.country,
                title: question.title,
                options: normalizeFourOptions(question.options),
                answerIndex: question.answerIndex,
                explanation: question.explanation,
              };
            }
          );

          setQuestions(nextQuestions);
          return;
        }

        setQuestions(createEmptySet(countryList[0]));
      } catch (fetchError: unknown) {
        if (controller.signal.aborted) return;
        setError(
          fetchError instanceof Error
            ? fetchError.message
            : "진단평가 정보를 불러오지 못했습니다."
        );
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    void load();

    return () => {
      controller.abort();
    };
  }, [mode, questionId]);

  const applyCountry = (countryId: number) => {
    const country = countries.find((item) => item.countryId === countryId);

    setQuestions((prev) =>
      prev.map((question) => ({
        ...question,
        id: undefined,
        countryId,
        country: country?.countryName ?? "",
      }))
    );
  };

  const updateQuestion = (
    questionIndex: number,
    patch: Partial<EvalutionQuestionFormData>
  ) => {
    setQuestions((prev) =>
      prev.map((question, index) =>
        index === questionIndex ? { ...question, ...patch } : question
      )
    );
  };

  const updateOption = (questionIndex: number, optionIndex: number, value: string) => {
    setQuestions((prev) =>
      prev.map((question, index) =>
        index === questionIndex
          ? {
              ...question,
              options: question.options.map((option, currentOptionIndex) =>
                currentOptionIndex === optionIndex ? value : option
              ),
            }
          : question
      )
    );
  };

  const validateForm = () => {
    if (!selectedCountryId) {
      setError("국가를 선택해주세요.");
      return false;
    }

    const invalidQuestionIndex = questions.findIndex(
      (question) =>
        !question.title.trim() ||
        normalizeFourOptions(question.options).some((option) => !option.trim())
    );

    if (invalidQuestionIndex >= 0) {
      setError(`${invalidQuestionIndex + 1}번 문제와 선택지를 모두 입력해주세요.`);
      return false;
    }

    setError("");
    return true;
  };

  const saveQuestionSet = async () => {
    const payloads = questions.map((question, index) => ({
      ...question,
      countryId: selectedCountryId,
      country: selectedCountry?.countryName ?? question.country,
      questionOrder: index + 1,
      title: question.title.trim(),
      options: normalizeFourOptions(question.options.map((option) => option.trim())),
      explanation: question.explanation.trim(),
    }));

    try {
      setIsSubmitting(true);
      setError("");
      const existingQuestions = await getEvalutionQuestions(
        selectedCountryId,
        selectedCountry?.countryName ?? payloads[0]?.country ?? "-"
      );
      const matchingQuestions = existingQuestions;
      const existingByOrder = new Map<number, number>();
      const duplicatedQuestionIds: number[] = [];

      matchingQuestions
        .sort((a, b) => a.id - b.id)
        .forEach((question) => {
          if (question.questionOrder < 1 || question.questionOrder > QUESTION_COUNT) {
            duplicatedQuestionIds.push(question.id);
            return;
          }

          if (existingByOrder.has(question.questionOrder)) {
            duplicatedQuestionIds.push(question.id);
            return;
          }

          existingByOrder.set(question.questionOrder, question.id);
        });

      const savedQuestionIds = new Set<number>();
      await Promise.all(
        payloads.map(async (payload) => {
          const existingId = payload.id ?? existingByOrder.get(payload.questionOrder);

          const savedQuestion = existingId
            ? await updateEvalutionQuestion(existingId, payload)
            : await createEvalutionQuestion(payload);

          savedQuestionIds.add(savedQuestion.id);
          if (existingId) savedQuestionIds.add(existingId);
        })
      );
      await Promise.all(
        duplicatedQuestionIds
          .filter((questionId) => !savedQuestionIds.has(questionId))
          .map((questionId) => deleteEvalutionQuestion(questionId))
      );

      setCompleteOpen(true);
    } catch (submitError: unknown) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "진단평가 세트 저장에 실패했습니다."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validateForm()) return;

    if (mode === "edit") {
      setEditConfirmOpen(true);
      return;
    }

    void saveQuestionSet();
  };

  if (isLoading) {
    return (
      <section className="rounded-[16px] border border-[#E4E7EC] bg-white p-8 text-center text-[14px] text-[#667085]">
        진단평가 세트를 불러오는 중입니다...
      </section>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-[860px]">
      <SubHeader
        backHref="/contentadmin/evalution"
        backText="진단평가 목록으로 돌아가기"
        title={mode === "create" ? "진단평가 세트 등록" : "진단평가 세트 수정"}
        description="한 국가의 진단평가는 5개 문항 세트로 관리합니다."
      />

      <AdminErrorBanner message={error} className="mb-4" />

      <section className="mb-6 rounded-[16px] border border-[#E4E7EC] bg-white p-6">
        <h2 className="mb-6 text-[17px] font-bold text-[#111827]">세트 정보</h2>

        <div className="grid grid-cols-1 gap-4">
          <label>
            <span className="mb-3 block text-[14px] font-semibold text-[#344054]">
              국가 <span className="text-red-500">*</span>
            </span>
            <select
              value={selectedCountryId || ""}
              onChange={(event) => applyCountry(Number(event.target.value))}
              className="h-[44px] w-full rounded-[10px] border border-[#E4E7EC] px-4 text-[14px] outline-none focus:border-[#639E9B]"
            >
              {countries.map((country) => (
                <option key={country.countryId} value={country.countryId}>
                  {country.countryName}
                </option>
              ))}
            </select>
          </label>
        </div>
      </section>

      <div className="space-y-5">
        {questions.map((question, questionIndex) => (
          <section
            key={question.questionOrder}
            className="rounded-[16px] border border-[#E4E7EC] bg-white p-6"
          >
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-[17px] font-bold text-[#111827]">
                {questionIndex + 1}번 문제
              </h2>
              <span className="text-[12px] font-semibold text-[#98A2B3]">
                선택지 4개 중 정답 1개
              </span>
            </div>

            <label className="mb-5 block">
              <span className="mb-3 block text-[14px] font-semibold text-[#344054]">
                문제 <span className="text-red-500">*</span>
              </span>
              <textarea
                value={question.title}
                onChange={(event) =>
                  updateQuestion(questionIndex, { title: event.target.value })
                }
                placeholder={`${questionIndex + 1}번 문제를 입력하세요`}
                maxLength={500}
                className="h-[96px] w-full resize-none rounded-[10px] border border-[#E4E7EC] px-4 py-3 text-[14px] outline-none placeholder:text-[#98A2B3] focus:border-[#639E9B]"
              />
            </label>

            <ol className="space-y-3">
              {normalizeFourOptions(question.options).map((option, optionIndex) => (
                <li
                  key={`${question.questionOrder}-${optionIndex}`}
                  className="flex h-[52px] items-center gap-3 rounded-[10px] border border-[#E4E7EC] bg-[#F9FAFB] px-3"
                >
                  <button
                    type="button"
                    onClick={() =>
                      updateQuestion(questionIndex, { answerIndex: optionIndex })
                    }
                    aria-label={`${questionIndex + 1}번 문제의 ${optionIndex + 1}번 선택지를 정답으로 지정`}
                    className={`flex h-[30px] w-[30px] items-center justify-center rounded-full border text-[13px] ${
                      question.answerIndex === optionIndex
                        ? "border-[#639E9B] bg-[#639E9B] text-white"
                        : "border-[#D0D5DD] bg-white text-[#98A2B3]"
                    }`}
                  >
                    {optionIndex + 1}
                  </button>
                  <input
                    type="text"
                    value={option}
                    onChange={(event) =>
                      updateOption(questionIndex, optionIndex, event.target.value)
                    }
                    placeholder={`선택지 ${optionIndex + 1}`}
                    className="min-w-0 flex-1 bg-transparent text-[14px] outline-none placeholder:text-[#98A2B3]"
                  />
                </li>
              ))}
            </ol>

            <label className="mt-5 block">
              <span className="mb-3 block text-[14px] font-semibold text-[#344054]">
                해설
              </span>
              <textarea
                value={question.explanation}
                onChange={(event) =>
                  updateQuestion(questionIndex, {
                    explanation: event.target.value,
                  })
                }
                placeholder="문항 해설을 입력하세요"
                className="h-[76px] w-full resize-none rounded-[10px] border border-[#E4E7EC] px-4 py-3 text-[14px] outline-none placeholder:text-[#98A2B3] focus:border-[#639E9B]"
              />
            </label>
          </section>
        ))}
      </div>

      <footer className="mt-6 rounded-[16px] border border-[#E4E7EC] bg-white p-6">
        <div className="grid grid-cols-2 gap-3">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex h-[44px] items-center justify-center rounded-[10px] bg-[#639E9B] text-[14px] font-semibold text-white disabled:cursor-not-allowed disabled:bg-[#D0D5DD]"
          >
            {isSubmitting
              ? "저장 중..."
              : mode === "create"
                ? "5문항 세트 등록"
                : "5문항 세트 수정"}
          </button>
          <button
            type="button"
            onClick={() => router.push("/contentadmin/evalution")}
            className="h-[44px] rounded-[10px] border border-[#E4E7EC] bg-white text-[14px] font-semibold text-[#344054]"
          >
            취소
          </button>
        </div>
      </footer>

      <Modal
        open={editConfirmOpen}
        title="진단평가 세트 수정"
        description="5개 문항 세트를 수정하시겠습니까?"
        confirmText="수정"
        cancelText="취소"
        onConfirm={() => {
          setEditConfirmOpen(false);
          void saveQuestionSet();
        }}
        onCancel={() => setEditConfirmOpen(false)}
      />

      <CompleteModal
        open={completeOpen}
        title={mode === "create" ? "등록 완료" : "수정 완료"}
        description={
          mode === "create"
            ? "진단평가 5문항 세트가 등록되었습니다."
            : "진단평가 5문항 세트가 수정되었습니다."
        }
        buttonText="확인"
        onConfirm={() => router.push("/contentadmin/evalution")}
      />
    </form>
  );
}
