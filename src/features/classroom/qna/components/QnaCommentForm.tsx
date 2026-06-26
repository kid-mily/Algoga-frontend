"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { createCourseQnaComment } from "@/features/services/courseQna.service";

interface QnaCommentFormProps {
    courseId: string;
    qnaId: string;
}

export default function QnaCommentForm({ courseId, qnaId }: QnaCommentFormProps) {
    const router = useRouter();

    const [content, setContent] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!content.trim()) {
        return;
        }

        try {
        setIsSubmitting(true);

        await createCourseQnaComment(courseId, qnaId, {
            content: content.trim(),
        });

        setContent("");
        router.refresh();
        } finally {
        setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="mt-8 flex gap-3">
            <input
                value={content}
                onChange={(event) => setContent(event.target.value)}
                placeholder="추가로 궁금한 내용을 입력해 주세요..."
                className="h-14 flex-1 rounded-2xl border border-slate-200 bg-white px-5 text-sm outline-none focus:border-[#6FA7A1]"
            />

            <button
                type="submit"
                disabled={isSubmitting}
                className="h-14 w-28 rounded-2xl bg-[#6FA7A1] text-sm font-semibold text-white hover:bg-[#5E9690] disabled:cursor-not-allowed disabled:opacity-60"
            >
                {isSubmitting ? "등록 중" : "등록하기"}
            </button>
        </form>
    );
}