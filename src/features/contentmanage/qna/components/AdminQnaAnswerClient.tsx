"use client";

import AdminErrorBanner from "@/features/common/components/AdminErrorBanner";
import CharCounter from "@/features/common/components/CharCounter";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import CompleteModal from "@/features/common/components/CompleteModal";
import LoadingSpinner from "@/features/common/components/LoadingSpinner";
import SubHeader from "@/features/common/components/SubHeader";
import type { AdminQnaBase } from "../types";
import {
  createAdminCourseQnaAnswer,
  getCourseQna,
} from "@/features/services/courseQna.service";

const QNA_ANSWER_MAX_LENGTH = 2000;

interface AdminQnaAnswerClientProps {
  courseId: string;
  qnaId: string;
  mode?: "answer" | "detail";
}

export default function AdminQnaAnswerClient({
  courseId,
  qnaId,
  mode = "answer",
}: AdminQnaAnswerClientProps) {
  const router = useRouter();
  const [qna, setQna] = useState<AdminQnaBase | null>(null);
  const [answer, setAnswer] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [completeOpen, setCompleteOpen] = useState(false);

  useEffect(() => {
    const fetchQna = async () => {
      if (!courseId || !qnaId) {
        setError("Q&A를 조회할 강의 정보가 없습니다.");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError("");
        const data = await getCourseQna(courseId, qnaId);
        setQna(data);
      } catch (fetchError: unknown) {
        setError(
          fetchError instanceof Error
            ? fetchError.message
            : "Q&A 상세 조회에 실패했습니다."
        );
      } finally {
        setIsLoading(false);
      }
    };

    queueMicrotask(() => {
      fetchQna();
    });
  }, [courseId, qnaId]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!answer.trim()) {
      setError("답변 내용을 입력해주세요.");
      return;
    }

    try {
      setIsSubmitting(true);
      setError("");
      await createAdminCourseQnaAnswer(courseId, qnaId, { answer: answer.trim() });
      setCompleteOpen(true);
    } catch (submitError: unknown) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "답변 등록에 실패했습니다."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#F8F8F8] px-8 py-8">
      <SubHeader
        backHref="/contentadmin/qna"
        backText="Q&A 목록으로 돌아가기"
        title={mode === "answer" ? "Q&A 답변 작성" : "Q&A 답변 상세"}
        description={qna?.title}
      />

      <AdminErrorBanner message={error} className="mt-4" />

      {isLoading ? (
        <section className="mt-5 rounded-[18px] bg-white">
          <LoadingSpinner text="Q&A 상세 내용을 불러오는 중입니다..." />
        </section>
      ) : qna ? (
        <>
          <article className="mt-5 rounded-[18px] border border-[#E4E7EC] bg-white p-5">
            <h2 className="text-[16px] font-bold text-[#111827]">학생 질문</h2>
            <section className="mt-5 flex gap-3">
              <span className="flex h-[38px] w-[38px] items-center justify-center rounded-full bg-[#EAF2FF] text-[16px] font-bold text-[#5B6EF5]">
                {qna.writer[0] || "?"}
              </span>
              <section>
                <header className="flex items-center gap-2">
                  <p className="text-[16px] font-bold text-[#111827]">
                    {qna.writer}
                  </p>
                  <time className="text-[13px] text-[#98A2B3]">
                    {qna.createdAt || "-"}
                  </time>
                </header>
                <h3 className="mt-2 text-[17px] font-semibold text-[#111827]">
                  {qna.title}
                </h3>
                <p className="mt-2 whitespace-pre-wrap text-[16px] font-medium text-[#344054]">
                  {qna.content}
                </p>
              </section>
            </section>
          </article>

          {qna.comments.length > 0 && (
            <section className="mt-5 rounded-[18px] border border-[#E4E7EC] bg-white p-5">
              <h2 className="text-[16px] font-bold text-[#111827]">등록된 답변</h2>
              <ol className="mt-4 space-y-3">
                {qna.comments.map((comment) => (
                  <li key={comment.id} className="rounded-[14px] bg-[#F9FAFB] p-4">
                    <p className="text-[14px] font-semibold text-[#111827]">
                      {comment.writer} · {comment.createdAt || "-"}
                    </p>
                    <p className="mt-2 whitespace-pre-wrap text-[14px] text-[#344054]">
                      {comment.content}
                    </p>
                  </li>
                ))}
              </ol>
            </section>
          )}

          <form
            onSubmit={handleSubmit}
            className="mt-5 rounded-[18px] border border-[#E4E7EC] bg-white p-5"
          >
            <label
              htmlFor="admin-qna-answer"
              className="text-[16px] font-bold text-[#111827]"
            >
              답변 작성
            </label>
            <textarea
              id="admin-qna-answer"
              value={answer}
              onChange={(event) => setAnswer(event.target.value)}
              placeholder="학생의 질문에 대한 답변을 작성해주세요..."
              maxLength={QNA_ANSWER_MAX_LENGTH}
              className="mt-5 h-[180px] w-full resize-none rounded-[14px] border border-[#E4E7EC] p-4 text-[14px] outline-none placeholder:text-[#98A2B3]"
              disabled={isSubmitting}
            />
            <div className="mt-1 flex justify-end">
              <CharCounter length={answer.length} maxLength={QNA_ANSWER_MAX_LENGTH} />
            </div>
            <footer className="mt-5 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => router.push("/contentadmin/qna")}
                className="h-[40px] rounded-[12px] border border-[#E4E7EC] px-4 text-[13px] font-semibold text-[#667085]"
              >
                취소
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !answer.trim()}
                className="h-[40px] rounded-[12px] bg-[#439A97] px-4 text-[13px] font-semibold text-white disabled:cursor-not-allowed disabled:bg-[#D0D5DD]"
              >
                {isSubmitting ? "등록 중..." : "답변 등록"}
              </button>
            </footer>
          </form>
        </>
      ) : (
        <section className="mt-5 rounded-[18px] bg-white p-10 text-center text-[14px] text-[#667085]">
          Q&A를 찾을 수 없습니다.
        </section>
      )}

      <CompleteModal
        open={completeOpen}
        title="등록 완료"
        description="답변 등록이 완료되었습니다."
        buttonText="확인"
        onConfirm={() => router.push("/contentadmin/qna")}
      />
    </main>
  );
}
