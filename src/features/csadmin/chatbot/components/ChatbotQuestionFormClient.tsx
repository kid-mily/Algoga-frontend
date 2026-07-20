"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminErrorBanner from "@/features/common/components/AdminErrorBanner";
import CompleteModal from "@/features/common/components/CompleteModal";
import Modal from "@/features/common/components/Modal";
import SubHeader from "@/features/common/components/SubHeader";
import {
  createAdminSuggestedQuestion,
  getAdminSuggestedQuestionById,
  updateAdminSuggestedQuestion,
} from "@/features/services/adminChatbot.service";
import { getErrorMessage } from "@/features/services/error.service";
import { ChatbotQuestionFormData } from "../types";

type ChatbotQuestionFormClientProps = {
  mode: "create" | "edit";
  questionId?: number;
};

const emptyForm: ChatbotQuestionFormData = {
  question: "",
  answer: "",
};

const VALIDATION_MESSAGES = [
  "예상 질문을 입력해주세요.",
  "답변 내용을 입력해주세요.",
];

export default function ChatbotQuestionFormClient({
  mode,
  questionId,
}: ChatbotQuestionFormClientProps) {
  const router = useRouter();
  const [formData, setFormData] = useState<ChatbotQuestionFormData>(emptyForm);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(mode === "edit");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isNotFound, setIsNotFound] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [completeOpen, setCompleteOpen] = useState(false);

  const title = mode === "create" ? "예상 질문 등록" : "예상 질문 수정";
  const completeTitle = mode === "create" ? "등록 완료" : "수정 완료";
  const completeDescription =
    mode === "create"
      ? "예상 질문이 등록되었습니다."
      : "예상 질문이 수정되었습니다.";
  const showQuestionError = hasSubmitted && !formData.question.trim();
  const showAnswerError = hasSubmitted && !formData.answer.trim();

  useEffect(() => {
    if (mode !== "edit" || !questionId) return;

    const controller = new AbortController();

    void (async () => {
      try {
        setIsLoading(true);
        setError("");

        const data = await getAdminSuggestedQuestionById(
          questionId,
          controller.signal
        );

        if (controller.signal.aborted) return;

        if (!data) {
          setIsNotFound(true);
          return;
        }

        setFormData({ question: data.question, answer: data.answer });
      } catch (fetchError: unknown) {
        if (controller.signal.aborted) return;

        setError(getErrorMessage(fetchError, "예상 질문 정보를 불러오지 못했습니다."));
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    })();

    return () => controller.abort();
  }, [mode, questionId]);

  const updateField = <K extends keyof ChatbotQuestionFormData>(
    key: K,
    value: ChatbotQuestionFormData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const validateForm = () => {
    if (!formData.question.trim()) {
      setError(VALIDATION_MESSAGES[0]);
      return false;
    }

    if (!formData.answer.trim()) {
      setError(VALIDATION_MESSAGES[1]);
      return false;
    }

    setError("");
    return true;
  };

  const submit = async () => {
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);
      setError("");

      const payload = {
        question: formData.question.trim(),
        answer: formData.answer.trim(),
      };

      if (mode === "edit" && questionId) {
        await updateAdminSuggestedQuestion(questionId, payload);
      } else {
        await createAdminSuggestedQuestion(payload);
      }

      setCompleteOpen(true);
    } catch (submitError: unknown) {
      setError(getErrorMessage(submitError, "예상 질문 처리에 실패했습니다."));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setHasSubmitted(true);

    if (!validateForm()) return;

    if (mode === "edit") {
      setConfirmOpen(true);
      return;
    }

    void submit();
  };

  const handleComplete = () => {
    setCompleteOpen(false);
    router.push("/csadmin/chatbot");
  };

  if (isNotFound) {
    return (
      <section className="rounded-[16px] border border-[#E4E7EC] bg-white p-8 text-center text-[14px] font-semibold text-[#667085]">
        예상 질문 정보를 찾을 수 없습니다.
      </section>
    );
  }

  if (isLoading) {
    return (
      <section className="rounded-[16px] border border-[#E4E7EC] bg-white p-8 text-center text-[14px] text-[#667085]">
        예상 질문 정보를 불러오는 중입니다...
      </section>
    );
  }

  return (
    <main aria-labelledby="chatbot-question-form-title">
      <header className="mb-6">
        <SubHeader
          backHref="/csadmin/chatbot"
          backText="예상 질문 목록으로 돌아가기"
          title={title}
          description="챗봇에 노출될 질문과 답변을 설정하세요"
        />
        <span id="chatbot-question-form-title" className="sr-only">
          {title}
        </span>
      </header>

      <AdminErrorBanner
        message={VALIDATION_MESSAGES.includes(error) ? "" : error}
        className="mb-4"
      />

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-[minmax(0,1fr)_360px] gap-6 xl:grid-cols-[minmax(0,1fr)_420px]"
      >
        <div className="space-y-6">
          <section className="rounded-[16px] border border-[#E4E7EC] bg-white p-6">
            <label
              htmlFor="chatbot-question"
              className="mb-3 block text-[14px] font-semibold text-[#344054]"
            >
              예상 질문 <span className="text-red-500">*</span>
            </label>
            <input
              id="chatbot-question"
              value={formData.question}
              onChange={(event) => updateField("question", event.target.value)}
              placeholder="예: 예약 취소는 어떻게 하나요?"
              className="h-[46px] w-full rounded-[10px] border border-[#E4E7EC] px-4 text-[14px] outline-none placeholder:text-[#98A2B3] focus:border-[#639E9B]"
            />
            {showQuestionError && (
              <p className="mt-2 text-[13px] font-semibold text-[#DC2626]">
                예상 질문을 입력해주세요.
              </p>
            )}
          </section>

          <section className="rounded-[16px] border border-[#E4E7EC] bg-white p-6">
            <label
              htmlFor="chatbot-answer"
              className="mb-3 block text-[14px] font-semibold text-[#344054]"
            >
              답변 내용 <span className="text-red-500">*</span>
            </label>
            <textarea
              id="chatbot-answer"
              value={formData.answer}
              onChange={(event) => updateField("answer", event.target.value)}
              placeholder="사용자에게 보여줄 답변을 입력하세요."
              className="h-[320px] w-full resize-none rounded-[10px] border border-[#E4E7EC] px-4 py-4 text-[14px] leading-7 outline-none placeholder:text-[#98A2B3] focus:border-[#639E9B]"
            />
            {showAnswerError && (
              <p className="mt-2 text-[13px] font-semibold text-[#DC2626]">
                답변 내용을 입력해주세요.
              </p>
            )}
          </section>
        </div>

        <aside className="space-y-6">
          <section className="rounded-[16px] border border-[#BBF7D0] bg-gradient-to-r from-[#DDF5DE] to-[#F3FBFB] p-5">
            <h2 className="mb-4 text-[16px] font-bold text-[#111827]">
              작성 기준
            </h2>
            <div className="space-y-3 text-[13px] font-semibold text-[#344054]">
              <p>· 사용자가 자주 묻는 표현으로 질문을 작성하세요</p>
              <p>· 답변은 2~3문장 안에서 핵심 절차를 먼저 안내하세요</p>
              <p>· 정책성 답변은 날짜, 비율, 조건을 명확히 적어주세요</p>
            </div>
          </section>

          <section className="rounded-[16px] border border-[#E4E7EC] bg-white p-5">
            <button
              type="submit"
              disabled={isSubmitting}
              className="mb-3 h-[46px] w-full cursor-pointer rounded-[10px] bg-[#639E9B] text-[14px] font-semibold text-white disabled:cursor-not-allowed disabled:bg-[#D0D5DD]"
            >
              {isSubmitting
                ? "처리 중..."
                : mode === "create"
                  ? "등록하기"
                  : "수정 완료"}
            </button>
            <button
              type="button"
              onClick={() => router.push("/csadmin/chatbot")}
              className="h-[46px] w-full cursor-pointer rounded-[10px] border border-[#E4E7EC] bg-white text-[14px] font-semibold text-[#344054]"
            >
              취소
            </button>
          </section>
        </aside>
      </form>

      <Modal
        open={confirmOpen}
        title="예상 질문 수정"
        description="예상 질문을 수정하시겠습니까?"
        confirmText={isSubmitting ? "수정 중..." : "수정"}
        cancelText="취소"
        confirmDisabled={isSubmitting}
        onConfirm={() => {
          setConfirmOpen(false);
          void submit();
        }}
        onCancel={() => setConfirmOpen(false)}
      />

      <CompleteModal
        open={completeOpen}
        title={completeTitle}
        description={completeDescription}
        buttonText="확인"
        onConfirm={handleComplete}
      />
    </main>
  );
}
