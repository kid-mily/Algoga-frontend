"use client";

import { FormEvent, useState } from "react";

interface CourseQnaCommentFormProps {
  onSubmit: (content: string) => Promise<boolean>;
}

export default function CourseQnaCommentForm({
  onSubmit,
}: CourseQnaCommentFormProps) {
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!content.trim()) {
      return;
    }

    setIsSubmitting(true);
    const success = await onSubmit(content.trim());
    setIsSubmitting(false);

    if (success) {
      setContent("");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-6 rounded-[16px] border border-[#E4E7EC] bg-white p-5"
    >
      <label
        htmlFor="qna-comment"
        className="text-[15px] font-semibold text-[#111827]"
      >
        댓글 작성
      </label>
      <textarea
        id="qna-comment"
        value={content}
        onChange={(event) => setContent(event.target.value)}
        placeholder="댓글을 입력해주세요"
        className="mt-3 h-[120px] w-full resize-none rounded-[14px] border border-[#D0D5DD] bg-[#F9FAFB] px-4 py-4 text-[15px] outline-none"
        disabled={isSubmitting}
      />
      <footer className="mt-4 flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting || !content.trim()}
          className="h-[42px] rounded-[14px] bg-[#439A97] px-5 text-[14px] font-semibold text-white disabled:cursor-not-allowed disabled:bg-[#D0D5DD]"
        >
          {isSubmitting ? "등록 중..." : "댓글 등록"}
        </button>
      </footer>
    </form>
  );
}
