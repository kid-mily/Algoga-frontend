"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import SubHeader from "@/features/common/components/SubHeader";
import { createCourseQna } from "@/features/services/courseQna.service";

interface CourseQnaCreateClientProps {
  continentCode: string;
  countryId: string;
  courseId: string;
}

export default function CourseQnaCreateClient({
  continentCode,
  countryId,
  courseId,
}: CourseQnaCreateClientProps) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const listPath = `/classroom/${continentCode}/${countryId}/lecture/${courseId}/qna`;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!title.trim() || !content.trim()) {
      setError("제목과 질문 내용을 모두 입력해주세요.");
      return;
    }

    try {
      setIsSubmitting(true);
      setError("");
      await createCourseQna(courseId, {
        title: title.trim(),
        content: content.trim(),
      });
      router.push(listPath);
      router.refresh();
    } catch (submitError: unknown) {
      const message =
        submitError instanceof Error
          ? submitError.message
          : "Q&A 등록에 실패했습니다.";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#F8F8F8] px-8 py-8">
      <SubHeader
        backHref={listPath}
        backText="Q&A 목록으로 돌아가기"
        title="Q&A 질문 작성"
        description="강의에 대해 궁금한 내용을 작성합니다"
      />

      {error && (
        <section
          role="alert"
          className="mt-4 rounded-[12px] border border-[#DC2626] bg-[#FEF2F2] p-4 text-[14px] font-medium text-[#DC2626]"
        >
          {error}
        </section>
      )}

      <form
        onSubmit={handleSubmit}
        className="mt-6 rounded-[20px] border border-[#E4E7EC] bg-white p-6"
      >
        <section>
          <label
            htmlFor="qna-title"
            className="text-[15px] font-semibold text-[#111827]"
          >
            제목
          </label>
          <input
            id="qna-title"
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="질문 제목을 입력해주세요"
            className="mt-3 h-[48px] w-full rounded-[14px] border border-[#D0D5DD] bg-[#F9FAFB] px-4 text-[15px] outline-none"
            disabled={isSubmitting}
          />
        </section>

        <section className="mt-6">
          <label
            htmlFor="qna-content"
            className="text-[15px] font-semibold text-[#111827]"
          >
            질문 내용
          </label>
          <textarea
            id="qna-content"
            value={content}
            onChange={(event) => setContent(event.target.value)}
            placeholder="궁금한 내용을 자세히 입력해주세요"
            className="mt-3 h-[220px] w-full resize-none rounded-[14px] border border-[#D0D5DD] bg-[#F9FAFB] px-4 py-4 text-[15px] outline-none"
            disabled={isSubmitting}
          />
        </section>

        <footer className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={() => router.push(listPath)}
            className="h-[44px] rounded-[14px] border border-[#D0D5DD] px-6 text-[14px] font-semibold text-[#344054]"
            disabled={isSubmitting}
          >
            취소
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="h-[44px] rounded-[14px] bg-[#439A97] px-6 text-[14px] font-semibold text-white disabled:cursor-not-allowed disabled:bg-[#D0D5DD]"
          >
            {isSubmitting ? "등록 중..." : "등록"}
          </button>
        </footer>
      </form>
    </main>
  );
}
