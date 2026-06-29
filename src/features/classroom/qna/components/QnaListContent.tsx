"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { formatQnaDate, getQnaWriterName, getStatusLabel } from "./utils";
import type { CourseQna } from "./types";

interface QnaListContentProps {
  qnas: CourseQna[];
  continentCode: string;
  countryid: string;
  courseId: string;
}

export default function QnaListContent({
  qnas,
  continentCode,
  countryid,
  courseId,
}: QnaListContentProps) {
  const [keyword, setKeyword] = useState("");

  const filteredQnas = useMemo(() => {
    const searchKeyword = keyword.trim().toLowerCase();

    if (!searchKeyword) return qnas;

    return qnas.filter((qna) => {
      return (
        qna.title.toLowerCase().includes(searchKeyword) ||
        qna.question.toLowerCase().includes(searchKeyword) ||
        getQnaWriterName(qna).toLowerCase().includes(searchKeyword)
      );
    });
  }, [keyword, qnas]);

  const baseHref = `/classroom/${continentCode}/${countryid}/lecture/${courseId}/qna`;

  return (
    <section>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <input
          value={keyword}
          onChange={(event) => setKeyword(event.target.value)}
          placeholder="강의 Q&A 검색"
          className="h-12 flex-1 rounded-2xl border border-[#DDE8EF] bg-white px-5 text-sm text-[#0A1628] outline-none placeholder:text-[#A0AEC0] focus:border-[#439A97]"
        />

        <Link
          href={`${baseHref}/new`}
          className="inline-flex h-12 items-center justify-center rounded-2xl bg-[#439A97] px-5 text-sm font-bold text-white shadow-sm transition hover:bg-[#357F7C]"
        >
          + 질문하기
        </Link>
      </div>

      {filteredQnas.length === 0 ? (
        <div className="rounded-2xl border border-[#E3E8F0] bg-white px-6 py-16 text-center shadow-[0_8px_24px_rgba(55,88,110,0.07)]">
          <p className="text-sm font-bold text-[#0A1628]">
            등록된 질문이 없습니다.
          </p>
          <p className="mt-2 text-sm text-[#8A94A6]">
            강의를 들으며 궁금한 내용을 자유롭게 남겨보세요.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredQnas.map((qna) => (
            <Link
              key={qna.qnaId}
              href={`${baseHref}/${qna.qnaId}`}
              className="block rounded-2xl border border-[#E1E8EF] bg-white p-6 shadow-[0_8px_24px_rgba(55,88,110,0.07)] transition hover:-translate-y-0.5 hover:shadow-[0_14px_34px_rgba(55,88,110,0.12)]"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#EEF8F7] text-sm font-bold text-[#357F7C]">
                    Q
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-bold text-[#0A1628]">
                        {getQnaWriterName(qna)}
                      </span>

                      <span className="text-xs text-[#A0AEC0]">
                        {formatQnaDate(qna.createdAt)}
                      </span>
                    </div>

                    <h2 className="mt-4 text-lg font-bold text-[#0A1628]">
                      {qna.title}
                    </h2>

                    <p className="mt-2 line-clamp-2 text-sm leading-6 text-[#718096]">
                      {qna.question}
                    </p>
                  </div>
                </div>

                <span
                  className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold ${
                    qna.status === "ANSWERED"
                      ? "bg-[#DDF8E7] text-[#4A9D64]"
                      : "bg-[#F1F5F9] text-[#64748B]"
                  }`}
                >
                  {getStatusLabel(qna.status)}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}