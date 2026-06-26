"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { formatQnaDate, getQnaWriterName, getStatusLabel } from "./utils";
import { CourseQna } from "./types";

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
      <div className="mb-6 flex items-center gap-3">
        <input
          value={keyword}
          onChange={(event) => setKeyword(event.target.value)}
          placeholder="여행 강의 Q&A 검색"
          className="h-12 flex-1 rounded-2xl border border-slate-200 bg-white px-5 text-sm outline-none focus:border-[#6FA7A1]"
        />

        <Link
          href={`${baseHref}/new`}
          className="rounded-2xl bg-[#6FA7A1] px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-[#5E9690]"
        >
          + 질문하기
        </Link>
      </div>

      <div className="space-y-4">
        {filteredQnas.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center">
            <p className="text-sm font-medium text-slate-600">
              등록된 질문이 없습니다.
            </p>

            <p className="mt-2 text-sm text-slate-400">
              여행 강의를 들으며 궁금한 내용을 자유롭게 남겨보세요.
            </p>
          </div>
        ) : (
          filteredQnas.map((qna) => (
            <Link
              key={qna.qnaId}
              href={`${baseHref}/${qna.qnaId}`}
              className="block rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#6FA7A1] text-sm font-bold text-white">
                    Q
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-[#0A1628]">
                        {getQnaWriterName(qna)}
                      </span>

                      <span className="text-xs text-slate-400">
                        {formatQnaDate(qna.createdAt)}
                      </span>
                    </div>

                    <h2 className="mt-4 text-lg font-bold text-[#0A1628]">
                      {qna.title}
                    </h2>

                    <p className="mt-2 line-clamp-2 text-sm text-slate-600">
                      {qna.question}
                    </p>
                  </div>
                </div>

                <span
                  className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${
                    qna.status === "ANSWERED"
                      ? "bg-[#DDF8E7] text-[#4A9D64]"
                      : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {getStatusLabel(qna.status)}
                </span>
              </div>
            </Link>
          ))
        )}
      </div>
    </section>
  );
}