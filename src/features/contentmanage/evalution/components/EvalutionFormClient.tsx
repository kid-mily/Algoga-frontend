"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import CompleteModal from "@/features/common/CompleteModal";
import Modal from "@/features/common/Modal";
import SubHeader from "@/features/contentmanage/common/SubHeader";
import {
  createEvalutionQuestion,
  getEvalutionQuestion,
  updateEvalutionQuestion,
} from "@/features/services/adminEvalution.service";
import {
  evalutionCountries,
  EvalutionLevel,
  EvalutionQuestionFormData,
  evalutionLevels,
} from "../types";

type EvalutionFormClientProps = {
  mode: "create" | "edit";
  questionId?: number;
};

const emptyForm: EvalutionQuestionFormData = {
  level: "초급",
  country: "남아프리카공화국",
  title: "",
  options: ["", "", ""],
  answerIndex: 0,
};

export default function EvalutionFormClient({
  mode,
  questionId,
}: EvalutionFormClientProps) {
  const router = useRouter();
  const [formData, setFormData] =
    useState<EvalutionQuestionFormData>(emptyForm);
  const [isLoading, setIsLoading] = useState(mode === "edit");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [editConfirmOpen, setEditConfirmOpen] = useState(false);
  const [completeOpen, setCompleteOpen] = useState(false);
  const titleLength = formData.title.length;

  useEffect(() => {
    const fetchQuestion = async () => {
      if (mode !== "edit" || !questionId) return;

      try {
        setIsLoading(true);
        setError("");
        const question = await getEvalutionQuestion(questionId);

        if (!question) {
          setError("진단평가 문제를 찾을 수 없습니다.");
          return;
        }

        setFormData({
          level: question.level,
          country: question.country,
          title: question.title,
          options: question.options.length >= 2 ? question.options : ["", ""],
          answerIndex: question.answerIndex,
        });
      } catch (fetchError: unknown) {
        setError(
          fetchError instanceof Error
            ? fetchError.message
            : "진단평가 문제를 불러오지 못했습니다."
        );
      } finally {
        setIsLoading(false);
      }
    };

    void fetchQuestion();
  }, [mode, questionId]);

  const updateOption = (index: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      options: prev.options.map((option, optionIndex) =>
        optionIndex === index ? value : option
      ),
    }));
  };

  const addOption = () => {
    setFormData((prev) => {
      if (prev.options.length >= 6) return prev;

      return {
        ...prev,
        options: [...prev.options, ""],
      };
    });
  };

  const removeOption = (index: number) => {
    setFormData((prev) => {
      if (prev.options.length <= 2) return prev;

      const nextOptions = prev.options.filter((_, optionIndex) => optionIndex !== index);
      const nextAnswerIndex =
        prev.answerIndex === index ? 0 : Math.min(prev.answerIndex, nextOptions.length - 1);

      return {
        ...prev,
        options: nextOptions,
        answerIndex: nextAnswerIndex,
      };
    });
  };

  const validateForm = () => {
    if (!formData.country.trim()) {
      setError("국가를 입력해주세요.");
      return false;
    }

    if (!formData.title.trim()) {
      setError("문제를 입력해주세요.");
      return false;
    }

    if (formData.options.some((option) => !option.trim())) {
      setError("선택지를 모두 입력해주세요.");
      return false;
    }

    setError("");
    return true;
  };

  const saveQuestion = async () => {
    const payload = {
      ...formData,
      country: formData.country.trim(),
      title: formData.title.trim(),
      options: formData.options.map((option) => option.trim()),
    };

    try {
      setIsSubmitting(true);

      if (mode === "edit" && questionId) {
        await updateEvalutionQuestion(questionId, payload);
      } else {
        await createEvalutionQuestion(payload);
      }

      setCompleteOpen(true);
    } catch (submitError: unknown) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "진단평가 문제 저장에 실패했습니다."
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

    void saveQuestion();
  };

  if (isLoading) {
    return (
      <section className="rounded-[16px] border border-[#E4E7EC] bg-white p-8 text-center text-[14px] text-[#667085]">
        진단평가 문제를 불러오는 중입니다...
      </section>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-[680px]">
      <header>
        <SubHeader
          backHref="/contentadmin/evalution"
          backText="진단평가 목록으로 돌아가기"
          title={mode === "create" ? "진단평가 문제 등록" : "진단평가 문제 수정"}
          description={
            mode === "create" ? "새 문제를 등록합니다." : "등록된 문제를 수정합니다."
          }
        />
      </header>

      {error && (
        <section
          role="alert"
          className="mb-4 rounded-[12px] bg-[#FEF2F2] p-4 text-[14px] text-[#DC2626]"
        >
          {error}
        </section>
      )}

      <section className="mb-6 rounded-[16px] border border-[#E4E7EC] bg-white p-6">
        <h2 className="mb-6 text-[17px] font-bold text-[#111827]">문제 내용</h2>

        <fieldset className="mb-6">
          <legend className="mb-3 block text-[14px] font-semibold text-[#344054]">
            난이도 <span className="text-red-500">*</span>
          </legend>

          <div className="grid grid-cols-3 gap-2">
            {evalutionLevels.map((difficulty) => (
              <button
                key={difficulty}
                type="button"
                onClick={() =>
                  setFormData((prev) => ({
                    ...prev,
                    level: difficulty as EvalutionLevel,
                  }))
                }
                className={`h-[42px] rounded-[10px] border text-[14px] font-semibold ${
                  difficulty === formData.level
                    ? "border-[#639E9B] bg-[#639E9B] text-white"
                    : "border-[#E4E7EC] bg-white text-[#344054]"
                }`}
              >
                {difficulty}
              </button>
            ))}
          </div>
        </fieldset>

        <label className="mb-6 block">
          <span className="mb-3 block text-[14px] font-semibold text-[#344054]">
            국가 <span className="text-red-500">*</span>
          </span>

          <select
            value={formData.country}
            onChange={(event) =>
              setFormData((prev) => ({ ...prev, country: event.target.value }))
            }
            className="h-[44px] w-full rounded-[10px] border border-[#E4E7EC] px-4 text-[14px] outline-none focus:border-[#639E9B]"
          >
            {evalutionCountries.map((country) => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="mb-3 block text-[14px] font-semibold text-[#344054]">
            문제 <span className="text-red-500">*</span>
          </span>

          <textarea
            value={formData.title}
            onChange={(event) =>
              setFormData((prev) => ({ ...prev, title: event.target.value }))
            }
            placeholder="문제를 입력하세요"
            maxLength={500}
            className="h-[110px] w-full resize-none rounded-[10px] border border-[#E4E7EC] px-4 py-3 text-[14px] outline-none placeholder:text-[#98A2B3] focus:border-[#639E9B]"
          />

          <p className="mt-2 text-right text-[12px] text-[#98A2B3]">
            {titleLength}자
          </p>
        </label>
      </section>

      <section className="mb-6 rounded-[16px] border border-[#E4E7EC] bg-white p-6">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-[17px] font-bold text-[#111827]">선택지</h2>
          <p className="text-[12px] text-[#98A2B3]">
            정답 버튼을 클릭해 정답을 지정하세요
          </p>
        </div>

        <ol className="space-y-3">
          {formData.options.map((option, index) => (
            <li
              key={index}
              className="flex h-[52px] items-center gap-3 rounded-[10px] border border-[#E4E7EC] bg-[#F9FAFB] px-3"
            >
              <button
                type="button"
                onClick={() =>
                  setFormData((prev) => ({ ...prev, answerIndex: index }))
                }
                aria-label={`${index + 1}번 선택지를 정답으로 지정`}
                className={`flex h-[30px] w-[30px] items-center justify-center rounded-full border text-[13px] ${
                  formData.answerIndex === index
                    ? "border-[#639E9B] bg-[#639E9B] text-white"
                    : "border-[#D0D5DD] bg-white text-[#98A2B3]"
                }`}
              >
                {index + 1}
              </button>

              <input
                type="text"
                value={option}
                onChange={(event) => updateOption(index, event.target.value)}
                placeholder={`선택지 ${index + 1}`}
                className="min-w-0 flex-1 bg-transparent text-[14px] outline-none placeholder:text-[#98A2B3]"
              />

              <button
                type="button"
                onClick={() => removeOption(index)}
                disabled={formData.options.length <= 2}
                aria-label={`${index + 1}번 선택지 삭제`}
                className="text-[#98A2B3] disabled:cursor-not-allowed disabled:opacity-40"
              >
                <img
                  src="/images/delete.svg"
                  alt=""
                  aria-hidden="true"
                  className="h-[16px] w-[16px]"
                />
              </button>
            </li>
          ))}
        </ol>

        <button
          type="button"
          onClick={addOption}
          disabled={formData.options.length >= 6}
          className="mt-6 flex h-[44px] w-full items-center justify-center gap-2 rounded-[10px] border border-dashed border-[#D0D5DD] text-[14px] font-semibold text-[#667085] disabled:cursor-not-allowed disabled:opacity-50"
        >
          <span aria-hidden="true" className="text-[18px] leading-none">
            +
          </span>
          선택지 추가 (최대 6개)
        </button>
      </section>

      <footer className="rounded-[16px] border border-[#E4E7EC] bg-white p-6">
        <div className="grid grid-cols-2 gap-3">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex h-[44px] items-center justify-center gap-2 rounded-[10px] bg-[#639E9B] text-[14px] font-semibold text-white disabled:cursor-not-allowed disabled:bg-[#D0D5DD]"
          >
            {isSubmitting
              ? "저장 중..."
              : mode === "create"
                ? "등록하기"
                : "수정하기"}
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
        title="진단평가 수정"
        description="수정하시겠습니까?"
        confirmText="수정"
        cancelText="취소"
        onConfirm={() => {
          setEditConfirmOpen(false);
          void saveQuestion();
        }}
        onCancel={() => setEditConfirmOpen(false)}
      />

      <CompleteModal
        open={completeOpen}
        title={mode === "create" ? "등록 완료" : "수정 완료"}
        description={
          mode === "create"
            ? "진단평가 문제가 등록되었습니다."
            : "진단평가 문제가 수정되었습니다."
        }
        buttonText="확인"
        onConfirm={() => router.push("/contentadmin/evalution")}
      />
    </form>
  );
}
