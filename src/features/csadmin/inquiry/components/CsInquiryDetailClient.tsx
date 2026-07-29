"use client";

import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import AdminErrorBanner from "@/features/common/components/AdminErrorBanner";
import SubHeader from "@/features/common/components/SubHeader";
import CompleteModal from "@/features/common/components/CompleteModal";
import Modal from "@/features/common/components/Modal";
import {
  answerAdminInquiry,
  getAdminInquiryById,
} from "@/features/services/adminInquiry.service";
import { CsInquiry } from "../types";

type CsInquiryDetailClientProps = {
  inquiryId: number;
};

export default function CsInquiryDetailClient({
  inquiryId,
}: CsInquiryDetailClientProps) {
  const router = useRouter();
  const [inquiry, setInquiry] = useState<CsInquiry | null>(null);
  const [answer, setAnswer] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [completeOpen, setCompleteOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const submitInFlightRef = useRef(false);

  const fetchInquiry = useCallback(async (signal?: AbortSignal) => {
    try {
      setIsLoading(true);
      setError("");

      const data = await getAdminInquiryById(inquiryId, signal);

      if (signal?.aborted) return;

      if (!data) {
        setError("고객 문의를 찾을 수 없습니다.");
        return;
      }

      setInquiry(data);
      setAnswer(data.answer ?? "");
    } catch (fetchError: unknown) {
      if (signal?.aborted) return;

      setError(
        fetchError instanceof Error
          ? fetchError.message
          : "고객 문의를 불러오지 못했습니다."
      );
    } finally {
      if (!signal?.aborted) {
        setIsLoading(false);
      }
    }
  }, [inquiryId]);

  useEffect(() => {
    const controller = new AbortController();

    void Promise.resolve().then(() => {
      if (!controller.signal.aborted) {
        void fetchInquiry(controller.signal);
      }
    });

    return () => controller.abort();
  }, [fetchInquiry]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!answer.trim()) {
      setError("답변 내용을 입력해주세요.");
      return;
    }

    setError("");
    setConfirmOpen(true);
  };

  const handleConfirmSubmit = async () => {
    if (!answer.trim() || submitInFlightRef.current) return;
    submitInFlightRef.current = true;

    try {
      setIsSubmitting(true);
      setConfirmOpen(false);
      setError("");
      await answerAdminInquiry(inquiryId, answer.trim());
      setCompleteOpen(true);
      await fetchInquiry();
    } catch (submitError: unknown) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "답변 등록에 실패했습니다."
      );
    } finally {
      submitInFlightRef.current = false;
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <section className="rounded-[16px] border border-[#E4E7EC] bg-white p-8 text-center text-[14px] text-[#667085]">
        고객 문의를 불러오는 중입니다...
      </section>
    );
  }

  return (
    <main aria-labelledby="cs-inquiry-detail-title">
      <SubHeader
        backHref="/csadmin/inquiry"
        backText="문의 목록으로 돌아가기"
        title={inquiry?.title ?? "고객 문의 상세"}
        description={inquiry ? `${inquiry.id} | ${inquiry.writer} | ${inquiry.date}` : undefined}
      />

      <AdminErrorBanner message={error} className="mb-4" />

      {inquiry && (
        <div className="grid gap-6">
          <article className="rounded-[16px] border border-[#E4E7EC] bg-white p-6">
            <h2 className="mb-5 text-[18px] font-bold text-[#111827]">
              문의 내용
            </h2>

            <dl className="grid grid-cols-[120px_1fr] gap-x-4 gap-y-4 text-[14px]">
              <dt className="font-semibold text-[#344054]">작성자</dt>
              <dd className="text-[#111827]">
                {inquiry.writer}
                <span className="ml-1 text-[13px] text-[#98A2B3]">
                  (회원 #{inquiry.userId})
                </span>
              </dd>

              <dt className="font-semibold text-[#344054]">문의 유형</dt>
              <dd className="text-[#111827]">{inquiry.type}</dd>

              <dt className="font-semibold text-[#344054]">처리 상태</dt>
              <dd
                className={
                  inquiry.statusCode === "PENDING"
                    ? "font-semibold text-[#F97316]"
                    : "font-semibold text-[#22C55E]"
                }
              >
                {inquiry.status}
              </dd>

              <dt className="font-semibold text-[#344054]">문의 내용</dt>
              <dd className="whitespace-pre-wrap leading-7 text-[#344054]">
                {inquiry.content}
              </dd>
            </dl>
          </article>

          <form
            onSubmit={handleSubmit}
            className="rounded-[16px] border border-[#E4E7EC] bg-white p-6"
          >
            <label htmlFor="inquiry-answer" className="block">
              <span className="mb-3 block text-[18px] font-bold text-[#111827]">
                관리자 답변
              </span>
              <textarea
                id="inquiry-answer"
                value={answer}
                onChange={(event) => setAnswer(event.target.value)}
                disabled={inquiry.statusCode === "ANSWERED" || isSubmitting}
                placeholder="고객에게 전달할 답변을 입력하세요"
                className="h-[180px] w-full resize-none rounded-[12px] border border-[#E4E7EC] px-4 py-3 text-[14px] outline-none placeholder:text-[#98A2B3] disabled:bg-[#F9FAFB]"
              />
            </label>

            <div className="mt-5 flex justify-end">
              <button
                type="submit"
                disabled={
                  inquiry.statusCode === "ANSWERED" ||
                  isSubmitting ||
                  !answer.trim()
                }
                className="h-[44px] rounded-[10px] bg-[#639E9B] px-6 text-[14px] font-semibold text-white disabled:cursor-not-allowed disabled:bg-[#D0D5DD]"
              >
                {isSubmitting ? "등록 중..." : "답변 등록"}
              </button>
            </div>
          </form>
        </div>
      )}

      <Modal
        open={confirmOpen}
        title="답변 전송"
        description="답변을 전송하시겠습니까?"
        confirmText={isSubmitting ? "전송 중..." : "전송"}
        cancelText="취소"
        confirmDisabled={isSubmitting}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={handleConfirmSubmit}
      />

      <CompleteModal
        open={completeOpen}
        title="답변 완료"
        description="문의 답변이 등록되었습니다."
        buttonText="확인"
        onConfirm={() => {
          setCompleteOpen(false);
          router.push("/csadmin/inquiry");
        }}
      />
    </main>
  );
}




