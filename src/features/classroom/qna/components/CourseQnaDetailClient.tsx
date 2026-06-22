"use client";

import SubHeader from "@/features/common/components/SubHeader";
import LoadingSpinner from "@/features/common/components/LoadingSpinner";
import { useCourseQnaDetail } from "../hooks/useCourseQnaDetail";
import CourseQnaCommentForm from "./CourseQnaCommentForm";

interface CourseQnaDetailClientProps {
  continentCode: string;
  countryId: string;
  courseId: string;
  qnaId: string;
}

export default function CourseQnaDetailClient({
  continentCode,
  countryId,
  courseId,
  qnaId,
}: CourseQnaDetailClientProps) {
  const { qna, isLoading, error, createComment } = useCourseQnaDetail(
    courseId,
    qnaId
  );
  const listPath = `/classroom/${continentCode}/${countryId}/lecture/${courseId}/qna`;

  return (
    <main className="min-h-screen bg-[#F8F8F8] px-8 py-8">
      <SubHeader
        backHref={listPath}
        backText="Q&A 목록으로 돌아가기"
        title="Q&A 상세"
        description="질문과 댓글을 확인합니다"
      />

      {error && (
        <section
          role="alert"
          className="mt-4 rounded-[12px] border border-[#DC2626] bg-[#FEF2F2] p-4 text-[14px] font-medium text-[#DC2626]"
        >
          {error}
        </section>
      )}

      {isLoading ? (
        <section className="mt-6 rounded-[16px] bg-white">
          <LoadingSpinner text="Q&A 상세 내용을 불러오는 중입니다..." />
        </section>
      ) : !qna ? (
        <section className="mt-6 rounded-[16px] bg-white p-10 text-center text-[14px] text-[#667085]">
          Q&A를 찾을 수 없습니다.
        </section>
      ) : (
        <>
          <article className="mt-6 rounded-[20px] border border-[#E4E7EC] bg-white p-6">
            <header>
              <section className="flex flex-wrap items-center justify-between gap-3">
                <h1 className="text-[24px] font-bold text-[#111827]">
                  {qna.title}
                </h1>
                <span
                  className={`rounded-full px-3 py-1 text-[12px] font-semibold ${
                    qna.isAnswered
                      ? "bg-[#ECFDF3] text-[#16A34A]"
                      : "bg-[#FFF7ED] text-[#EA580C]"
                  }`}
                >
                  {qna.isAnswered ? "답변 완료" : "답변 대기"}
                </span>
              </section>
              <p className="mt-2 text-[13px] text-[#98A2B3]">
                {qna.writer} · {qna.createdAt || "-"}
              </p>
            </header>

            <p className="mt-6 whitespace-pre-wrap text-[15px] leading-7 text-[#344054]">
              {qna.content || "질문 내용이 없습니다."}
            </p>
          </article>

          <section
            aria-labelledby="qna-comments-title"
            className="mt-6 rounded-[20px] border border-[#E4E7EC] bg-white p-6"
          >
            <h2
              id="qna-comments-title"
              className="text-[20px] font-bold text-[#111827]"
            >
              댓글
            </h2>

            {qna.comments.length === 0 ? (
              <p className="mt-5 text-[14px] text-[#667085]">
                아직 등록된 댓글이 없습니다.
              </p>
            ) : (
              <ol className="mt-5 space-y-4">
                {qna.comments.map((comment) => (
                  <li
                    key={comment.id}
                    className="rounded-[14px] bg-[#F9FAFB] p-4"
                  >
                    <article>
                      <header className="flex flex-wrap items-center justify-between gap-2">
                        <strong className="text-[14px] text-[#111827]">
                          {comment.writer}
                        </strong>
                        <time
                          dateTime={comment.createdAt}
                          className="text-[12px] text-[#98A2B3]"
                        >
                          {comment.createdAt || "-"}
                        </time>
                      </header>
                      <p className="mt-3 whitespace-pre-wrap text-[14px] leading-6 text-[#344054]">
                        {comment.content}
                      </p>
                    </article>
                  </li>
                ))}
              </ol>
            )}
          </section>

          <CourseQnaCommentForm onSubmit={createComment} />
        </>
      )}
    </main>
  );
}
