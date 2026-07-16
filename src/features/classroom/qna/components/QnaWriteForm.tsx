"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { createCourseQna } from "@/features/services/userQna.service";
import CharCounter from "@/features/common/components/CharCounter";

const QNA_TITLE_MAX_LENGTH = 100;
const QNA_QUESTION_MAX_LENGTH = 2000;

interface QnaWriteFormProps {
    continentCode: string;
    countryid: string;
    courseId: string;
}

export default function QnaWriteForm({
    continentCode,
    countryid,
    courseId,
}: QnaWriteFormProps) {
    const router = useRouter();

    const [title, setTitle] = useState("");
    const [question, setQuestion] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const listHref = `/classroom/${continentCode}/${countryid}/lecture/${courseId}/qna`;

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!title.trim()) {
        setErrorMessage("질문 제목을 입력해 주세요.");
        return;
        }

        if (!question.trim()) {
        setErrorMessage("질문 내용을 입력해 주세요.");
        return;
        }

        try {
        setIsSubmitting(true);
        setErrorMessage("");

        await createCourseQna(courseId, {
            title: title.trim(),
            question: question.trim(),
        });

        router.push(listHref);
        router.refresh();
        } catch (error) {
        setErrorMessage(
            error instanceof Error
            ? error.message
            : "질문 등록 중 오류가 발생했습니다."
        );
        } finally {
        setIsSubmitting(false);
        }
    };

    return (
        <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-slate-100 bg-white p-7 shadow-sm"
        >
        <div className="mb-8 flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#6FA7A1] text-sm font-bold text-white">
            Q
            </div>

            <div>
            <p className="text-sm font-bold text-[#0A1628]">강의 질문</p>
            <p className="text-xs text-slate-400">
                강의, 여행 준비, 자료 내용에 대해 질문할 수 있습니다.
            </p>
            </div>
        </div>

        <div className="space-y-5">
            <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-600">
                제목
            </span>
            <input
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="질문 제목을 입력해 주세요."
                maxLength={QNA_TITLE_MAX_LENGTH}
                className="h-14 w-full rounded-2xl border border-transparent bg-[#F5F6FA] px-4 text-sm outline-none focus:border-[#6FA7A1]"
            />
            <div className="mt-1 flex justify-end">
                <CharCounter length={title.length} maxLength={QNA_TITLE_MAX_LENGTH} />
            </div>
            </label>

            <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-600">
                질문 내용
            </span>
            <textarea
                value={question}
                onChange={(event) => setQuestion(event.target.value)}
                placeholder="궁금한 내용을 자세하게 작성해 주세요."
                maxLength={QNA_QUESTION_MAX_LENGTH}
                className="h-40 w-full resize-none rounded-2xl border border-transparent bg-[#F5F6FA] px-4 py-4 text-sm outline-none focus:border-[#6FA7A1]"
            />
            <div className="mt-1 flex justify-end">
                <CharCounter length={question.length} maxLength={QNA_QUESTION_MAX_LENGTH} />
            </div>
            </label>
        </div>

        {errorMessage ? (
            <p className="mt-4 text-sm font-medium text-red-500">
            {errorMessage}
            </p>
        ) : null}

        <div className="mt-10 flex justify-end gap-3">
            <button
            type="button"
            onClick={() => router.push(listHref)}
            className="h-12 w-28 rounded-2xl bg-slate-300 text-sm font-semibold text-white hover:bg-slate-400"
            >
            취소
            </button>

            <button
            type="submit"
            disabled={isSubmitting}
            className="h-12 w-32 rounded-2xl bg-[#6FA7A1] text-sm font-semibold text-white hover:bg-[#5E9690] disabled:cursor-not-allowed disabled:opacity-60"
            >
            {isSubmitting ? "등록 중..." : "등록하기"}
            </button>
        </div>
        </form>
    );
}